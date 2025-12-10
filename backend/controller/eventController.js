import Event from "../models/Event.js";
import cloudinary from "../utils/cloudinary.js";
import Registration from "../models/Registration.js";
import User from "../models/User.js";

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      venue,
      price,
      capacity,
      category,
    } = req.body;

    let bannerData = { url: "", public_id: "" };

    // Upload Banner to Cloudinary if file exists
    if (req.file) {
      const cloudResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "event-system/events" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(req.file.buffer); // <-- IMPORTANT (NO PIPE)
      });

      bannerData = {
        url: cloudResult.secure_url,
        public_id: cloudResult.public_id,
      };
    }

    const event = await Event.create({
      title,
      description,
      date,
      time,
      venue,
      price,
      capacity,
      category,
      banner: bannerData,
      createdBy: req.user.id,
    });

    return res.json({
      success: true,
      message: "Event created successfully",
      event,
    });

  } catch (error) {
    console.error("Create Event Error:", error);
    return res.status(500).json({ error: error.message });
  }
};


export const getEvents = async (req, res) => {
  try {
    const userId = req.user?.id; // If user is logged in

    let events = await Event.find().sort({ date: 1 }).lean();

    // If NO user logged in → send events without isRegistered
    if (!userId) {
      events = events.map(ev => ({ ...ev, isRegistered: false }));
      return res.json(events);
    }

    // Get all registrations of this user
    const userRegs = await Registration.find({ userId }).select("eventId");

    const registeredIds = userRegs.map(r => r.eventId.toString());

    // Attach isRegistered to each event
    events = events.map(event => ({
      ...event,
      isRegistered: registeredIds.includes(event._id.toString())
    }));

    return res.json(events);

  } catch (err) {
    console.error("Event Fetch Error:", err);
    res.status(500).json({ error: err.message });
  }
};




export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    res.json(event);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    const event = await Event.findById(eventId);
    if (!event)
      return res.status(404).json({ message: "Event not found" });

    // Delete image from cloudinary
    if (event.banner?.public_id) {
      await cloudinary.uploader.destroy(event.banner.public_id);
    }

    await Event.findByIdAndDelete(eventId);

    res.json({ message: "Event deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getTicketByEventId = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.params;

    // Fetch registration for this event & user
    const reg = await Registration.findOne({ userId, eventId });
    if (!reg) {
      return res.status(404).json({ message: "You are not registered for this event" });
    }

    // Fetch event details
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Build ticket response
    const ticketData = {
      qrCode: reg.qrCode,
      ticketId: reg._id,
      eventName: event.title,
      venue: event.venue,
      date: event.date,
      userName: req.user.name,
      userEmail: req.user.email
    };

    return res.json(ticketData);

  } catch (error) {
    console.error("Ticket Fetch Error:", error);
    return res.status(500).json({ error: error.message });
  }
};


export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });

    const totalEvents = await Event.countDocuments();
    const paidEvents = await Event.countDocuments({ price: { $gt: 0 } });
    const freeEvents = totalEvents - paidEvents;

    const totalRegistrations = await Registration.countDocuments();

    const revenueData = await Registration.aggregate([
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event"
        }
      },
      { $unwind: "$event" },
      { $match: { "event.price": { $gt: 0 } } },
      {
        $group: { _id: null, total: { $sum: "$event.price" } }
      }
    ]);

    const revenue = revenueData[0]?.total || 0;

    // MONTHLY REGISTRATION TREND
const rawGrowth = await Registration.aggregate([
  {
    $group: {
      _id: { month: { $month: "$createdAt" } },
      registrations: { $sum: 1 }
    }
  },
  { $sort: { "_id.month": 1 } }
]);

// Create default 12 months
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const monthlyGrowth = months.map((monthName, index) => {
  const monthIndex = index + 1;

  const found = rawGrowth.find(r => r._id.month === monthIndex);

  return {
    month: monthName,
    registrations: found ? found.registrations : 0
  };
});


    return res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          active: activeUsers,
        },
        events: {
          total: totalEvents,
          paid: paidEvents,
          free: freeEvents,
        },
        registrations: {
          total: totalRegistrations,

        },
        revenue,
        monthlyGrowth:monthlyGrowth, // add later
      },
    });

  } catch (err) {
    console.error("Stats API error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
};


export const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate("userId", "name email")
      .populate("eventId", "title date venue price");
    res.json({ success: true, registrations });
  } catch (err) {
    console.error("Fetch All Registrations Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch registrations" });
  }
};


export const verifyCheckIn = async (req, res) => {
  try {
    const { ticketId } = req.body;

    if (!ticketId)
      return res.status(400).json({ success: false, message: "Invalid QR Code" });

    // 1️⃣ Find the registration
    const reg = await Registration.findOne({ _id: ticketId })
      .populate("userId", "name email")
      .populate("eventId", "title");

    if (!reg)
      return res.status(404).json({ success: false, message: "Ticket not found" });

    // 2️⃣ If already checked in → return early
    if (reg.checkIn)
      return res.json({
        success: true,
        already: true,
        user: reg.userId,
        event: reg.eventId,
        time: reg.checkInTime,
      });

    // 3️⃣ Mark as checked-in
    reg.checkIn = true;
    reg.checkInTime = new Date();
    await reg.save();

    return res.json({
      success: true,
      already: false,
      user: reg.userId,
      event: reg.eventId,
      time: reg.checkInTime,
    });

  } catch (err) {
    console.error("CheckIn error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;


    const {
      title,
      description,
      date,
      time,
      venue,
      price,
      capacity,
      category,
    } = req.body;

    // Fetch existing event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }

    let bannerData = event.banner; // Keep old banner if no new file uploaded

    // If new banner uploaded → replace old Cloudinary image
    if (req.file) {
      // Delete old image if exists
      if (event.banner && event.banner.public_id) {
        await cloudinary.uploader.destroy(event.banner.public_id);
      }

      // Upload new image
      const cloudResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "event-system/events" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      bannerData = {
        url: cloudResult.secure_url,
        public_id: cloudResult.public_id,
      };
    }

    // Update event fields
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        title,
        description,
        date,
        time,
        venue,
        price,
        capacity,
        category,
        banner: bannerData,
      },
      { new: true } // return updated event
    );

    return res.json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
    });

  } catch (error) {
    console.error("Update Event Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Something went wrong",
    });
  }
};







