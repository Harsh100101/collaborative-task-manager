import { Task } from "../models/task.model";

export const taskRepository = {
	create: (data: any) => Task.create(data),

	findAll: (filter: any) => Task.find(filter).sort({ dueDate: 1 }),

	findById: (id: string) => Task.findById(id),

	updateById: (id: string, data: any) =>
		Task.findByIdAndUpdate(id, data, { new: true }),

	deleteById: (id: string) => Task.findByIdAndDelete(id),
};
