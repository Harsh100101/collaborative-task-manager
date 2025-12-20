import { z } from "zod";

export const loginDto = z.object({
	email: z.string().email(),
	password: z.string(),
});

export const RegisterDto = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(6),
});

export type RegisterDtoType = z.infer<typeof RegisterDto>;
