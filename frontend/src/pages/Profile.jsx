import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // your auth context
import axiosInstance from "../utils/axiosInstance";

const Profile = () => {
  const { user, setUser ,updateProfile} = useAuth();
  const [preview, setPreview] = useState(null);
  

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    studentId: "",
    course: "",
    section: "",
    city: "",
    department: "",
    year: "",
    emergencyContact: "",
    avatar: null,
  });

  // Load user data when page opens
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        college: user.college || "",
        studentId: user.studentId || "",
        course: user.course || "",
        section: user.section || "",
        city: user.city || "",
        department: user.department || "",
        year: user.year || "",
        emergencyContact: user.emergencyContact || "",
        avatar: user.avatar || null,
      });

      if (user.avatar?.url) {
        setPreview(user.avatar.url);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, avatar: file });
    if (file) setPreview(URL.createObjectURL(file));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  let updatedForm = { ...form };

  // Convert image to base64 if File
  if (form.avatar instanceof File) {
    const base64 = await toBase64(form.avatar);
    updatedForm.avatar = base64;  // send base64 string to backend
  }

  await updateProfile(updatedForm);
};

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });



  return (
<div className="p-6 max-w-4xl mx-auto">

  {/* PAGE TITLE */}
  <h1 className="text-4xl font-extrabold mb-10 text-gray-800 tracking-wide">
    My Profile
  </h1>

  <form
    onSubmit={handleSubmit}
    className="bg-white/70 backdrop-blur-xl border border-gray-200 p-10 rounded-3xl shadow-xl space-y-12"
  >

    {/* ================= AVATAR ================= */}
    <div className="flex items-center gap-8">
      <div className="relative group">
        <img
          src={preview || "/default-avatar.png"}
          alt="profile"
          className="w-28 h-28 rounded-full object-cover shadow-lg border-2 border-gray-300 transition-all group-hover:shadow-2xl"
        />

        <label className="absolute -bottom-2 right-0 cursor-pointer">
          <div className="bg-red-500 group-hover:bg-red-600 text-white px-4 py-1 text-xs rounded-full shadow-md transition">
            Change
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatar}
          />
        </label>
      </div>

      <div>
        <p className="text-xl font-semibold">{form.name || "Your Name"}</p>
        <p className="text-gray-500 text-sm">{form.email}</p>
      </div>
    </div>

    {/* ================= PERSONAL INFO ================= */}
    <section>
      <h2 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2">
        Personal Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {[
          ["Full Name", "name"],
          ["Phone", "phone"],
          ["City", "city"],
          ["Emergency Contact", "emergencyContact"]
        ].map(([label, key]) => (
          <div key={key}>
            <label className="font-medium text-gray-600">{label}</label>
            <input
              type="text"
              name={key}
              value={form[key]}
              onChange={handleChange}
              className="w-full bg-gray-100 focus:bg-white border focus:border-red-400 p-3 rounded-lg mt-1 transition shadow-sm focus:shadow-md"
            />
          </div>
        ))}

      </div>
    </section>

    {/* ================= ACADEMIC INFO ================= */}
    <section>
      <h2 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2">
        Academic Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {[
          ["College", "college"],
          ["Student ID", "studentId"],
          ["Course", "course"],
          ["Section", "section"],
          ["Department", "department"],
          ["Year", "year", "number"]
        ].map(([label, key, type]) => (
          <div key={key}>
            <label className="font-medium text-gray-600">{label}</label>
            <input
              type={type || "text"}
              name={key}
              value={form[key]}
              onChange={handleChange}
              className="w-full bg-gray-100 focus:bg-white border focus:border-red-400 p-3 rounded-lg mt-1 transition shadow-sm focus:shadow-md"
            />
          </div>
        ))}

      </div>
    </section>

    {/* ================= SAVE BUTTON ================= */}
    <button
      type="submit"
      className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-lg font-semibold shadow-lg transition transform hover:scale-[1.02]"
    >
      Update Profile
    </button>

  </form>
</div>

  );
};

export default Profile;
