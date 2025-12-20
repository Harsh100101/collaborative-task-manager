import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL + "/api",
	withCredentials: true, // 🔥 required for cookies + CORS
});

// ✅ ADD INTERCEPTOR HERE
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

export default api;
