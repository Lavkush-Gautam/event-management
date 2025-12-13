import React, { useRef, useState } from "react";
import axios from 'axios'
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

    const otpRefs =useRef([]);

 
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/request-reset-otp", { email });
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.error || "Error sending OTP");
    }
  };


  const handleOtpChange = (e, index) => {
  const value = e.target.value.replace(/\D/g, ""); // allow only digits

  if (!value) return;

  const newOtp = otp.split("");
  newOtp[index] = value;
  const finalOtp = newOtp.join("");
  setOtp(finalOtp);

  // Move to next box automatically
  if (index < 5) otpRefs.current[index + 1].focus();
};

const handleOtpBackspace = (e, index) => {
  if (e.key === "Backspace" && index > 0 && !e.target.value) {
    otpRefs.current[index - 1].focus();
  }
};

 
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/verify-reset-otp", { email, otp });
      toast.success("OTP verified!");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid OTP");
    }
  };

  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/reset-password", { email, newPassword });
      toast.success("Password reset successfully!");
      window.location.href = "/"; // redirect
    } catch (err) {
      toast.error(err.response?.data?.error || "Reset failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 mt-16">
      <div className="bg-white p-8  w-full max-w-md space-y-6">

      
       {step === 1 && (
  <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200">

    {/* Heading */}
    <div className="text-center mb-6">
      <h2 className="text-3xl font-bold text-gray-800">Forgot Password?</h2>
      <p className="text-gray-500 mt-2 text-sm leading-relaxed">
        No worries! Enter your registered email and we’ll send you  
        a <span className="font-semibold text-gray-700">6-digit OTP</span> to reset your password.
      </p>
    </div>

    {/* Email Form */}
    <form onSubmit={handleEmailSubmit} className="space-y-5">

      {/* Email Input */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Email Address</label>
        <input
          type="email"
          className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-red-400 outline-none"
          placeholder="example@gmail.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Button */}
      <button
        className="w-full bg-red-600 hover:bg-red-700 transition text-white py-3 rounded-lg font-medium"
      >
        Send OTP
      </button>
    </form>

    {/* Extra Note */}
    <p className="text-xs text-gray-500 text-center mt-4">
      Make sure to check your spam folder if the email doesn't arrive.
    </p>

  </div>
)}


{step === 2 && (
  <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200 mt-10">

    {/* Title */}
    <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
      Verify OTP
    </h2>

    <p className="text-gray-600 text-center text-sm mb-6">
      We sent a 6-digit OTP to  <br /><span className="font-medium">{email}</span>
    </p>

    {/* OTP BOXES */}
    <form onSubmit={handleOtpSubmit} className="space-y-6">
      <div className="flex justify-center gap-3">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            ref={(el) => (otpRefs.current[index] = el)}
            onChange={(e) => handleOtpChange(e, index)}
            onKeyDown={(e) => handleOtpBackspace(e, index)}
            className="w-12 h-12 text-center text-xl font-bold border border-gray-300 
                       bg-gray-100 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
          />
        ))}
      </div>

      {/* Verify Button */}
      <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition">
        Verify OTP
      </button>
    </form>

    {/* Change Email */}
    <div className="text-center mt-4">
      <button
        onClick={() => setStep(1)}
        className="text-sm text-red-600 hover:underline font-medium"
      >
        Change Email?
      </button>
    </div>
  </div>
)}

       {step === 3 && (
  <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200">

    {/* Heading */}
    <div className="text-center mb-6">
      <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
      <p className="text-gray-500 mt-2 text-sm">
        Create a strong new password to secure your account.
      </p>
    </div>

    {/* Form */}
    <form onSubmit={handleResetPassword} className="space-y-5">

      {/* New Password */}
      <div>
        <label className="font-medium text-gray-700">New Password</label>
        <input
          type="password"
          className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-red-400 outline-none"
          placeholder="Enter new password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      {/* Confirm Password */}
      <div>
        <label className="font-medium text-gray-700">Confirm Password</label>
        <input
          type="password"
          className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-red-400 outline-none"
          placeholder="Re-enter new password"
          required
        />
      </div>

      {/* Button */}
      <button
        className="w-full bg-green-600 hover:bg-green-700 transition text-white 
                   py-3 rounded-lg font-medium"
      >
        Reset Password
      </button>

    </form>

    {/* Footer Note */}
    <p className="text-xs text-gray-500 text-center mt-4">
      Make sure this password is different from the previous one.
    </p>

  </div>
)}


      </div>
    </div>
  );
};

export default ForgotPassword;
