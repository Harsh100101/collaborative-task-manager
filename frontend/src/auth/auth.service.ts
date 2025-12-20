import api from "../api/axios";

export const authService = {
	login: async (data: { email: string; password: string }) => {
		const res = await api.post("/auth/login", data);

		// ✅ STORE TOKEN AFTER LOGIN
		localStorage.setItem("token", res.data.token);

		return res.data;
	},

	register: (data: { name: string; email: string; password: string }) =>
		api.post("/auth/register", data),
};

export const registerUser = async (data: {
	name: string;
	email: string;
	password: string;
}) => {
	const res = await api.post("/api/auth/register", data);
	return res.data;
};
