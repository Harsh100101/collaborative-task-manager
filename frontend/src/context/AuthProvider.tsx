import React, { useState, useEffect } from "react";
import { AuthContext, type User } from "./AuthContext";
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(() => {
		try {
			const raw = localStorage.getItem("user");
			return raw ? (JSON.parse(raw) as User) : null;
		} catch {
			return null;
		}
	});

	useEffect(() => {
		console.log("AuthProvider mounted - user:", user);
	}, [user]);

	const login = (u: User) => {
		console.log("AuthProvider.login ->", u);
		setUser(u);
		try {
			localStorage.setItem("user", JSON.stringify(u));
		} catch (e) {
			console.warn("Failed to persist user:", e);
		}
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("user");
		localStorage.removeItem("token");
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
