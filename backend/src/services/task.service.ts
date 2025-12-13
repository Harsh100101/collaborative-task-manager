import mongoose from "mongoose";
import { taskRepository } from "../repositories/task.repository";
import { getIO } from "../socket";

export const taskService = {
	async createTask(data: any, creatorId: string) {
		const task = await taskRepository.create({
			...data,
			creatorId: new mongoose.Types.ObjectId(creatorId),
			assignedToId: new mongoose.Types.ObjectId(data.assignedToId),
		});

		const io = getIO();

		// 🔔 Notify assigned user (personal room)
		io.to(data.assignedToId).emit("task:assigned", task);

		// 🔔 Broadcast task creation to all
		io.emit("task:created", task);

		return task;
	},

	async getTasks(userId: string, query: any) {
		const userObjectId = new mongoose.Types.ObjectId(userId);

		const filter: any = {
			$or: [{ creatorId: userObjectId }, { assignedToId: userObjectId }],
		};

		if (query.status) filter.status = query.status;
		if (query.priority) filter.priority = query.priority;

		return taskRepository.findAll(filter);
	},

	async updateTask(taskId: string, data: any) {
		const task = await taskRepository.updateById(taskId, data);

		const io = getIO();
		io.emit("task:updated", task);

		return task;
	},

	async deleteTask(taskId: string) {
		return taskRepository.deleteById(taskId);
	},
};
