import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "https://collegeevent-fi2q.onrender.com/api",
  withCredentials: true, // Enable sending cookies with requests
});
export default axiosInstance;