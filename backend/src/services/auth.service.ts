import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository";

export const authService = {
	async register(name: string, email: string, password: string) {
		const existing = await userRepository.findByEmail(email);
		if (existing) {
			throw new Error("User already exists");
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await userRepository.create({
			name,
			email,
			password: hashedPassword,
		});

		return user;
	},

	async login(email: string, password: string) {
		const user = await userRepository.findByEmail(email);
		if (!user) {
			throw new Error("Invalid credentials");
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			throw new Error("Invalid credentials");
		}

		const token = jwt.sign(
			{ id: user._id, email: user.email },
			process.env.JWT_SECRET as string,
			{ expiresIn: "7d" }
		);

		return { user, token };
	},
};
