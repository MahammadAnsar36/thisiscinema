import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://backend-an9o.onrender.com", // ✅ LIVE backend URL
  headers: {
    "Content-Type": "application/json"
  }
});

export default axiosClient;
