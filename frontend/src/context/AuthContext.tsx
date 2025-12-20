// small non-component module — safe for fast refresh
import { createContext } from "react";

export interface User {
	id: string;
	name: string;
	email: string;
}

export interface AuthContextType {
	user: User | null;
	login: (user: User) => void;
	logout: () => void;
}

// ONLY export the context (no components in this file)
export const AuthContext = createContext<AuthContextType | null>(null);
