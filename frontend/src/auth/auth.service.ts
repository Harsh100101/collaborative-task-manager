import api from "../api/axios";

export const authService = {
	login: (data: { email: string; password: string }) =>
		api.post("/auth/login", data),

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
