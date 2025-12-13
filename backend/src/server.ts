import "dotenv/config"; // 🔑 loads .env FIRST

import http from "http";
import app from "./app";
import { initSocket } from "./socket";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// ✅ Connect database BEFORE server starts
connectDB();

// 🔔 Initialize socket AFTER server is created
initSocket(server);

server.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
});
