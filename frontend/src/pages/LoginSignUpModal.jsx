import React, { useState, useEffect, useRef } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useAuthModal } from "../context/AuthModalContext";
import { useAuth } from "../context/AuthContext";

const LoginSignupModal = () => {
    const { isOpen, closeModal, tab, setTab } = useAuthModal();
    const { login, register } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const modalRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            gsap.fromTo(
                modalRef.current,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.25, ease: "power2.out" }
            );
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Handle input change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.type === "text" ? "name" : e.target.name]: e.target.value });
    };

    // LOGIN SUBMIT
    const handleLogin = async () => {
        try {
            setError("");
            await login(form.email, form.password);
            closeModal();
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    // Handle avatar upload
    const handleAvatar = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setForm({ ...form, avatar: reader.result }); // base64
        };
        reader.readAsDataURL(file);
    };

    const handleSignup = async () => {
        try {
            setError("");
            await register({
                name: form.name,
                email: form.email,
                password: form.password,
            });
            setTab("login");
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
            <div
                ref={modalRef}
                className="bg-white rounded-2xl w-full max-w-md p-6 shadow-lg relative"
            >
                {/* CLOSE */}
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-black"
                    onClick={closeModal}
                >
                    <X size={22} />
                </button>

                {/* ERROR MESSAGE */}
                {error && (
                    <p className="text-red-500 text-sm mb-2 text-center">
                        {error}
                    </p>
                )}

                {/* LOGIN */}
                {tab === "login" && (
                 <div className="space-y-6">

    {/* Heading */}
    <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-gray-500 text-sm mt-1">
            Login to continue your journey
        </p>
    </div>

    {/* Email Input */}
    <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-400 outline-none"
        onChange={handleChange}
    />

    {/* Password Input */}
    <div className="relative">
        <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-400 outline-none"
            onChange={handleChange}
        />

        <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer text-gray-500"
        >
            {showPassword ? <EyeOff /> : <Eye />}
        </span>
    </div>

    {/* Forgot Password */}
    <div onClick={()=>closeModal()} className="text-right">
        <Link
            to="/forgot-password"
            className="text-sm text-green-600 hover:underline"
        >
            Forgot Password?
        </Link>
    </div>

    {/* Login Button */}
    <button
        className="w-full bg-red-500 hover:bg-red-600 transition text-white py-3 rounded-lg font-medium"
        onClick={handleLogin}
    >
        Login
    </button>

    {/* Signup Link */}
    <p className="text-sm text-center text-gray-600 mt-4">
        Don't have an account?
        <span
            className="text-red-600 font-semibold cursor-pointer ml-1"
            onClick={() => setTab("signup")}
        >
            Signup
        </span>
    </p>

</div>

                )}

                {tab === "signup" && (
                    <div className="space-y-6">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
                            <p className="text-gray-500 text-sm mt-1">Join us and explore events</p>
                        </div>

                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center gap-3">
                            <img
                                src={form.avatar || "/default-avatar.png"}
                                className="w-20 h-20 rounded-full object-cover border"
                                alt="avatar preview"
                            />

                            <label className="cursor-pointer bg-gray-200 px-3 py-1 rounded-md text-sm">
                                Upload Avatar
                                <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
                            </label>
                        </div>

                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
                            onChange={handleChange}
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
                            onChange={handleChange}
                        />

                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
                                onChange={handleChange}
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </span>
                        </div>

                        <button
                            className="w-full bg-red-500 text-white py-3 rounded-lg"
                            onClick={handleSignup}
                        >
                            Create Account
                        </button>

                        <p className="text-sm text-center text-gray-600 mt-4">
                            Already have an account?
                            <span
                                className="text-red-600 font-semibold cursor-pointer ml-1"
                                onClick={() => setTab("login")}
                            >
                                Login
                            </span>
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default LoginSignupModal;
