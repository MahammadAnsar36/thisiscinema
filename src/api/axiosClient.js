// src/api/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://backend-production-fcb7f.up.railway.app", // ✅ your Railway backend
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // optional if using cookies or secure auth
});

export default axiosClient;
