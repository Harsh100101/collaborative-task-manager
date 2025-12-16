import { Server } from "socket.io";
import http from "http";


let io: Server;

export const initSocket = (server: http.Server) => {
	io = new Server(server, {
		cors: {
			origin: "http://localhost:5173",
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

