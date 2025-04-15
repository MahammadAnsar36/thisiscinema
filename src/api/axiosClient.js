const axiosClient = axios.create({
  baseURL: "https://backend-production-fcb7f.up.railway.app", // ✅ CORRECT LIVE BACKEND
  headers: { "Content-Type": "application/json" }
});
