import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";

const app = express();

// ✅ CORS (use env for production)
app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"https://collaborative-task-manager.vercel.app",
			/\.vercel\.app$/, // ✅ allows ALL Vercel preview deployments
		],
		credentials: true,
	})
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Health check
app.get("/", (_req: Request, res: Response) => {
	res.send("API is running 🚀");
});

export default app;
