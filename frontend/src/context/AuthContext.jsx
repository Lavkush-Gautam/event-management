import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState([]);

  // Fetch logged-in user on refresh
  const loadUser = async () => {
    try {
      const res = await axiosInstance.get("/auth/profile");
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // LOGIN
  const login = async (email, password) => {

    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      toast.success("Logged in successfully!");
      setUser(res.data.user);
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      throw error;

    }
  };


  // UPDATE PROFILE
const updateProfile = async (formData) => {
  try {
    const body = { ...formData };

    // // Convert avatar (File) to base64 if needed
    // if (formData.avatar instanceof File) {
    //   body.avatar = await toBase64(formData.avatar);
    // }

    const res = await axiosInstance.put("/auth/update-profile", body);

    setUser(res.data.user);
    toast.success("Profile updated successfully!");
    return res.data;

  } catch (error) {
    toast.error(error.response?.data?.message || "Update failed");
    throw error;
  }
};

  // REGISTER
  const register = async (data) => {
    
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      toast.success("Registered successfully!");
      setUser(res.data.user);
      return res.data;
      
    } catch (error) {
      
      toast.error(error.response?.data?.message || "Registration failed");
      throw error;
    }
  };

  // LOGOUT
  const logout = async () => {
    
    try {
      await axiosInstance.post("/auth/logout");
       setUser(null);
      toast.success("Logged out successfully!");
      
    } catch (error) {
      toast.error("Logout failed");
      throw error;
      
    }
  };


  const fetchAllUsers = async () => {
  try {
    const res = await axiosInstance.get("/auth/all-users");

    console.log("Loaded Users (Context):", res.data.users);

    setUserList(res.data.users);
    return res.data.users;

  } catch (err) {
    console.error("Fetch all users error:", err);
  }
};

  // FREE EVENT REGISTRATION
  const registerForEvent = async (eventId) => {
    try {
      const res = await axiosInstance.post(`/registration/${eventId}`);
      toast.success("Registered successfully!");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      throw error;
    }
  };

  const getMyRegistrations = async () => {
    try {
      const res = await axiosInstance.get(`/registration/my`);
      toast.success("Registered successfully!");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      throw error;
    }
  };

   const cancelRegistration = async (eventId) => {
    try {
      const res = await axiosInstance.delete(`/registration/${eventId}`);
      toast.success("Deleted successfully!");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Deletion failed");
      throw error;
    }
  };


  // CREATE ORDER FOR PAID EVENT
  const createOrder = async (eventId) => {
    try {
      const res = await axiosInstance.post(`/payment/create-order`, { eventId });
      return res.data;
    } catch (error) {
      toast.error("Failed to create order");
      throw error;
    }
  };

  // VERIFY PAYMENT AFTER SUCCESS
  const verifyPayment = async (paymentData) => {
    try {
      const res = await axiosInstance.post(`/payment/verify`, paymentData);
      toast.success("Payment verified!");
      return res.data;
    } catch (error) {
      toast.error("Payment verification failed");
      throw error;
    }
  };



const [payments, setPayments] = useState([]);

const fetchPayments = async () => {
  try {
    const res = await axiosInstance.get("/payment/all");
    setPayments(res.data.payments);
    return res.data.payments;
  } catch (err) {
    console.error("Fetch Payments Error:", err);
  }
};




  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        registerForEvent,
        createOrder,
        verifyPayment,
        loading,
        login,
        register,
        logout,
        updateProfile,
        getMyRegistrations,
        cancelRegistration,
        fetchAllUsers,
        userList,
        payments,
        fetchPayments
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use context easily
export const useAuth = () => useContext(AuthContext);
