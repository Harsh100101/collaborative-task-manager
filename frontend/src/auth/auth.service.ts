import api from "../api/axios";

export const authService = {
	login: async (data: { email: string; password: string }) => {
		const res = await api.post("/auth/login", data);

		// store token only if backend returned one (your backend currently sets cookie instead)
		if (res.data?.token) {
			localStorage.setItem("token", res.data.token);
		}

		// return the response body (so callers get res.data directly)
		return res.data;
	},

	register: async (data: {
		name: string;
		email: string;
		password: string;
	}) => {
		const res = await api.post("/auth/register", data);
		return res.data;
	},
};
