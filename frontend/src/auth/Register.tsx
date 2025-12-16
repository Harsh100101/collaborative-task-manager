import { useState } from "react";
import { authService } from "./auth.service";
import { useNavigate, Link } from "react-router-dom";
import type { AxiosError } from "axios";

export default function Register() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		try {
			await authService.register({
				name,
				email,
				password,
			});

			// ✅ After successful registration, go to login
			navigate("/login");
		} catch (err) {
			const error = err as AxiosError<{ message: string }>;
			setError(error.response?.data?.message || "Registration failed");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-900">
			<form
				onSubmit={handleSubmit}
				className="bg-gray-800 p-6 rounded-lg w-80 space-y-4"
			>
				<h2 className="text-xl text-white text-center">Register</h2>

				{error && <p className="text-red-400 text-sm">{error}</p>}

				<input
					type="text"
					placeholder="Name"
					className="w-full p-2 rounded bg-gray-700 text-white"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
				/>

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

				<button className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded">
					Register
				</button>

				<p className="text-sm text-center text-gray-400">
					Already have an account?{" "}
					<Link to="/login" className="text-blue-400 hover:underline">
						Login
					</Link>
				</p>
			</form>
		</div>
	);
}
