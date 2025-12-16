import { useState } from "react";
import { authService } from "./auth.service";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { Link } from "react-router-dom";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		try {
			const res = await authService.login({
				email,
				password,
			});

			login(res.data);
			navigate("/dashboard");
		} catch (err) {
			const error = err as AxiosError<{ message: string }>;
			setError(error.response?.data?.message || "Login failed");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-900">
			<form
				onSubmit={handleSubmit}
				className="bg-gray-800 p-6 rounded-lg w-80 space-y-4"
			>
				<h2 className="text-xl text-white text-center">Login</h2>

				{error && <p className="text-red-400 text-sm">{error}</p>}

				<input
					type="email"
					placeholder="Email"
					className="w-full p-2 rounded bg-gray-700 text-white"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>

				<input
					type="password"
					placeholder="Password"
					className="w-full p-2 rounded bg-gray-700 text-white"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>

				<button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
					Login
				</button>
				<p className="text-sm text-center text-gray-400">
					Don’t have an account?{" "}
					<Link
						to="/register"
						className="text-blue-400 hover:underline"
					>
						Register
					</Link>
				</p>
			</form>
		</div>
	);
}
