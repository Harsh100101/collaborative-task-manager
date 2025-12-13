import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
	user?: {
		id: string;
		email: string;
	};
}

export const authenticate = (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	const token = req.cookies?.token;

	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
			id: string;
			email: string;
		};

		req.user = decoded;
		next();
	} catch {
		return res.status(401).json({ message: "Invalid token" });
	}
};
