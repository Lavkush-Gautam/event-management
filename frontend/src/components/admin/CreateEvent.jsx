import React, { useState } from "react";
import { useEvents } from "../../context/EventContext";
import toast from "react-hot-toast";
import UpComing from "../UpComing";

const CreateEvent = () => {
  const { createEvent, loading } = useEvents();
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    price: 0,
    capacity: "",
    category: "other",
    banner: null
  });

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, banner: file });

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // Submit FormData
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    const result = await createEvent(formData);

    if (result.success) {
      setForm({
        title: "",
        description: "",
        date: "",
        time: "",
        venue: "",
        price: 0,
        capacity: "",
        category: "other",
        banner: null
      });
      setPreview(null);
    } else {
     toast.error(result.error || "Failed to create event");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">

 <UpComing
        title="Create New Event"
        subtitle="Fill in the details to create an event"
      />

  <form
    onSubmit={handleSubmit}
    className="bg-white p-6   border border-gray-100 space-y-6"
  >

    {/* ---------- TITLE ---------- */}
    <div>
      <label className="block font-semibold text-gray-700">Event Name</label>
      <input
        type="text"
        name="title"
        placeholder="e.g., Tech Fest 2025"
        value={form.title}
        onChange={handleChange}
        className="w-full mt-1 p-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
        required
      />
    </div>

    {/* ---------- DESCRIPTION ---------- */}
    <div>
      <label className="block font-semibold text-gray-700">Description</label>
      <textarea
        name="description"
        placeholder="Tell attendees what the event is about..."
        value={form.description}
        onChange={handleChange}
        rows={4}
        className="w-full mt-1 p-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
        required
      ></textarea>
    </div>

    {/* ---------- BANNER UPLOAD ---------- */}
    <div>
      <label className="block font-semibold text-gray-700 mb-1">Event Banner</label>

      <div className="flex items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full bg-gray-100 p-3 border border-gray-300 rounded-lg"
        />
      </div>

      {preview && (
        <img
          src={preview}
          alt="Event Preview"
          className="mt-3 w-full h-48 object-cover rounded-lg shadow"
        />
      )}
    </div>

    {/* ---------- DATE & TIME ---------- */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block font-semibold text-gray-700">Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full mt-1 p-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
          required
        />
      </div>

      <div>
        <label className="block font-semibold text-gray-700">Time</label>
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          className="w-full mt-1 p-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
          required
        />
      </div>
    </div>

    {/* ---------- VENUE ---------- */}
    <div>
      <label className="block font-semibold text-gray-700">Venue</label>
      <input
        type="text"
        name="venue"
        placeholder="Where is your event happening?"
        value={form.venue}
        onChange={handleChange}
        className="w-full mt-1 p-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
        required
      />
    </div>

    {/* ---------- PRICE & CAPACITY ---------- */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block font-semibold text-gray-700">Price (₹)</label>
        <input
          type="number"
          name="price"
          placeholder="0 for free"
          value={form.price}
          onChange={handleChange}
          className="w-full mt-1 p-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
        />
      </div>

      <div>
        <label className="block font-semibold text-gray-700">Capacity</label>
        <input
          type="number"
          name="capacity"
          placeholder="How many people can join?"
          value={form.capacity}
          onChange={handleChange}
          className="w-full mt-1 p-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
          required
        />
      </div>
    </div>

    {/* ---------- CATEGORY ---------- */}
    <div>
      <label className="block font-semibold text-gray-700">Category</label>
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="w-full mt-1 p-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
      >
        <option value="technical">Technical</option>
        <option value="cultural">Cultural</option>
        <option value="sports">Sports</option>
        <option value="workshop">Workshop</option>
        <option value="seminar">Seminar</option>
        <option value="other">Other</option>
      </select>
    </div>

    {/* ---------- SUBMIT BUTTON ---------- */}
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 bg-red-400 hover:bg-red-500 text-white rounded-md cursor-pointer transition active:scale-[0.98]"
    >
      {loading ? "Creating Event..." : " Create Event"}
    </button>
  </form>
</div>

  );
};

export default CreateEvent;
