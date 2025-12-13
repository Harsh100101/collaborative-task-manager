import { User } from "../models/User";

export const userRepository = {
	findByEmail: (email: string) => {
		return User.findOne({ email });
	},

	create: (data: { name: string; email: string; password: string }) => {
		return User.create(data);
	},
};
