import axios from "axios";

const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
// ensure single /api suffix (handles trailing slash in env)
const apiBase = base.replace(/\/$/, "") + "/api";

const api = axios.create({
	baseURL: apiBase,
	withCredentials: true, // required if server sets HttpOnly cookie
});

// Optional: attach token from localStorage if you use header-based JWTs
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers = config.headers || {};
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default api;
