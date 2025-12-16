import { createContext, useState } from "react";
import type { ReactNode } from "react";

type User = {
	id: string;
	name: string;
	email: string;
};

type AuthContextType = {
	user: User | null;
	login: (user: User) => void;
	logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(() => {
		try {
			const storedUser = localStorage.getItem("user");
			if (!storedUser || storedUser === "undefined") return null;
			return JSON.parse(storedUser);
		} catch {
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
