import { useAuth } from "../context/useAuth";

export default function Dashboard() {
	const { user } = useAuth();
	console.log("Dashboard user:", user);

	return <h1>Dashboard</h1>;
}
