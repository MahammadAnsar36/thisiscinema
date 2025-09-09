import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://thisiscinema-back.onrender.com", // ✅ LIVE backend URL
  headers: {
    "Content-Type": "application/json"
  }
});

export default axiosClient;
