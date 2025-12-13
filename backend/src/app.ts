import express from "express";

const app = express();

// Middleware
app.use(express.json());

// Health check route
app.get("/", (_req, res) => {
	res.send("API is running 🚀");
});

export default app;
