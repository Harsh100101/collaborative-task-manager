import api from "../api/axios";

export const authService = {
	login: (data: { email: string; password: string }) =>
		api.post("/auth/login", data),

	register: (data: { name: string; email: string; password: string }) =>
		api.post("/auth/register", data),
};
