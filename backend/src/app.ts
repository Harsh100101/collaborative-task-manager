import express from "express";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
	res.send("API is running 🚀");
});

export default app;
