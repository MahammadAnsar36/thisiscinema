import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://backend-production-fcb7f.up.railway.app", // ✅ LIVE backend URL
  headers: {
    "Content-Type": "application/json"
  }
});

export default axiosClient;
