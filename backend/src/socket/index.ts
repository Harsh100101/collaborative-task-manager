import { Server } from "socket.io";
import http from "http";

let io: Server;

export const initSocket = (server: http.Server) => {
	const allowedOrigins = [
		"http://localhost:5173",
		"https://collaborative-task-manager.vercel.app",
		/\.vercel\.app$/,
	];

	io = new Server(server, {
		cors: {
			origin: (origin, callback) => {
				if (!origin) return callback(null, true);
				const isAllowed = allowedOrigins.some((o) =>
					o instanceof RegExp ? o.test(origin) : o === origin
				);
				if (isAllowed) callback(null, true);
				else callback(new Error("Socket CORS not allowed"), false);
			},
			credentials: true,
		},
	});

	io.on("connection", (socket) => {
		console.log("User connected:", socket.id);

		socket.on("join:user", (userId: string) => {
			socket.join(userId);
		});

		socket.on("disconnect", () => {
			console.log("User disconnected:", socket.id);
		});
	});

	return io;
};

export const getIO = () => {
	if (!io) {
		throw new Error("Socket.io not initialized");
	}
	return io;
};
