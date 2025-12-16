import mongoose from "mongoose";
import { taskRepository } from "../repositories/task.repository";


export const taskService = {
	async createTask(data: any, creatorId: string) {
		return taskRepository.create({
			...data,
			creatorId: new mongoose.Types.ObjectId(creatorId),
			assignedToId: new mongoose.Types.ObjectId(data.assignedToId),
		});
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

	async getTaskById(taskId: string) {
		return taskRepository.findById(taskId);
	},

	async updateTask(taskId: string, data: any) {
		return taskRepository.updateById(taskId, data);
	},

	async deleteTask(taskId: string) {
		return taskRepository.deleteById(taskId);
	},
};
