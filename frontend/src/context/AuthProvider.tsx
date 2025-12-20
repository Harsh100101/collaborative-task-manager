import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext, type User } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(() => {
		try {
			const storedUser = localStorage.getItem("user");
			if (!storedUser || storedUser === "undefined") return null;
			return JSON.parse(storedUser);
		} catch {
			localStorage.removeItem("user");
			return null;
		}
	});

	const login = (user: User) => {
		localStorage.setItem("user", JSON.stringify(user));
		setUser(user);
	};

	const logout = () => {
		localStorage.removeItem("user");
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
