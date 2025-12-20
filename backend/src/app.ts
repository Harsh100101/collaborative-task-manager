import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";

const app = express();

// Allowed origins (add your exact production frontends here)
const allowedOrigins = [
	"http://localhost:5173",
	"https://collaborative-task-manager.vercel.app",
	/\.vercel\.app$/, // allow Vercel preview deployments
];

const corsOptions = {
	origin: (
		origin: string | undefined,
		callback: (err: Error | null, allow?: boolean) => void
	) => {
		// allow requests with no origin (like mobile apps or curl)
		if (!origin) return callback(null, true);

		const isAllowed = allowedOrigins.some((o) => {
			if (o instanceof RegExp) return o.test(origin);
			return o === origin;
		});

		if (isAllowed) {
			callback(null, true);
		} else {
			callback(new Error("CORS policy: This origin is not allowed"));
		}
	},
	credentials: true,
};

app.use(cors(corsOptions));
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
