import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { registerDto, loginDto } from "../dto/auth.dto";

export const register = async (req: Request, res: Response) => {
	try {
		const parsed = registerDto.parse(req.body);

		const user = await authService.register(
			parsed.name,
			parsed.email,
			parsed.password
		);

		res.status(201).json({
			id: user._id,
			name: user.name,
			email: user.email,
		});
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const parsed = loginDto.parse(req.body);

		const { user, token } = await authService.login(
			parsed.email,
			parsed.password
		);

		res.cookie("token", token, {
			httpOnly: true,
			sameSite: "lax",
			secure: false,
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
