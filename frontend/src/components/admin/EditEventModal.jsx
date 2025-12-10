import React, { useState, useEffect } from "react";
import { useEvents } from "../../context/EventContext";
import toast from "react-hot-toast";

const EditEventModal = ({ open, setOpen, eventData }) => {
    const { updateEvent, loading } = useEvents();

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
        banner: null,
    });

    // Prefill form when modal opens
    useEffect(() => {
        if (eventData) {
            setForm({
                title: eventData.title,
                description: eventData.description,
                date: eventData.date.split("T")[0],
                time: eventData.time || "",
                venue: eventData.venue,
                price: eventData.price,
                capacity: eventData.capacity,
                category: eventData.category,
                banner: eventData.banner.url || null,
            });

            setPreview(eventData.banner.url);
        }
    }, [eventData]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setForm({ ...form, banner: file });

        if (file) setPreview(URL.createObjectURL(file));
    };

    // Submit Update
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(form).forEach((key) => {
            formData.append(key, form[key]);
        });

        const result = await updateEvent(eventData._id, formData);

        if (result.success) {
            toast.success("Event updated successfully");
            setOpen(false);
        } else {
            toast.error(result.error || "Update failed");
        }
    };

    if (!open) return null; // Don't render modal if closed

    return (
        <div className="fixed inset-0  bg-opacity-40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">

                {/* Close Button */}
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-black"
                    onClick={() => setOpen(false)}
                >
                    ✖
                </button>

                <h2 className="text-2xl font-semibold mb-4">Edit Event</h2>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* ---------- TITLE ---------- */}
                    <div>
                        <label className="font-semibold">Event Name</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full mt-1 p-3 bg-gray-100 border rounded-lg"
                            required
                        />
                    </div>

                    {/* ---------- DESCRIPTION ---------- */}
                    <div>
                        <label className="font-semibold">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full mt-1 p-3 bg-gray-100 border rounded-lg"
                            required
                        ></textarea>
                    </div>

                    {/* ---------- BANNER UPLOAD ---------- */}
                    <div>
                        <label className="font-semibold">Event Banner</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full mt-1 p-3 bg-gray-100 border rounded-lg"
                        />
                        {preview && (
                            <img src={preview} className="mt-3 w-full h-48 object-cover rounded-lg" />
                        )}
                    </div>

                    {/* ---------- DATE + TIME ---------- */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="font-semibold">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                className="w-full mt-1 p-3 bg-gray-100 border rounded-lg"
                                required
                            />
                        </div>

                        <div>
                            <label className="font-semibold">Time</label>
                            <input
                                type="time"
                                name="time"
                                value={form.time}
                                onChange={handleChange}
                                className="w-full mt-1 p-3 bg-gray-100 border rounded-lg"
                                required
                            />
                        </div>
                    </div>

                    {/* ---------- VENUE ---------- */}
                    <div>
                        <label className="font-semibold">Venue</label>
                        <input
                            type="text"
                            name="venue"
                            value={form.venue}
                            onChange={handleChange}
                            className="w-full mt-1 p-3 bg-gray-100 border rounded-lg"
                            required
                        />
                    </div>

                    {/* ---------- PRICE + CAPACITY ---------- */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="font-semibold">Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                className="w-full mt-1 p-3 bg-gray-100 border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="font-semibold">Capacity</label>
                            <input
                                type="number"
                                name="capacity"
                                value={form.capacity}
                                onChange={handleChange}
                                className="w-full mt-1 p-3 bg-gray-100 border rounded-lg"
                            />
                        </div>
                    </div>

                    {/* ---------- CATEGORY ---------- */}
                    <div>
                        <label className="font-semibold">Category</label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full mt-1 p-3 bg-gray-100 border rounded-lg"
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
                        className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        {loading ? "Updating..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditEventModal;
