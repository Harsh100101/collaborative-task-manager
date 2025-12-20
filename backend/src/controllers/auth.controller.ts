import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { RegisterDto, loginDto } from "../dto/auth.dto";
import { registerUser } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
	try {
		const user = await registerUser(req.body);

		res.status(201).json({
			message: "User registered successfully",
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (error: any) {
		res.status(400).json({
			message: error.message || "Registration failed",
		});
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const parsed = loginDto.parse(req.body);

		const { user, token } = await authService.login(
			parsed.email,
			parsed.password
		);

		const isProd = process.env.NODE_ENV === "production";

		// For cross-site cookies (frontend and backend on different origins),
		// you must set sameSite: 'none' and secure: true in production.
		res.cookie("token", token, {
			httpOnly: true,
			sameSite: isProd ? "none" : "lax",
			secure: isProd ? true : false,
			// optionally set `maxAge` or `expires` here
		});

		res.json({
			id: user._id,
			name: user.name,
			email: user.email,
		});
	} catch (error: any) {
		res.status(401).json({ message: error.message });
	}
};
