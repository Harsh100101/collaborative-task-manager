import { Task } from "../models/task.model";
import { ITask } from "../models/task.model";

export const taskRepository = {
	create(data: Partial<ITask>) {
		return Task.create(data);
	},

	findAll(filter: any) {
		return Task.find(filter).sort({ createdAt: -1 });
	},

	findById(id: string) {
		return Task.findById(id);
	},

	updateById(id: string, data: Partial<ITask>) {
		return Task.findByIdAndUpdate(id, data, { new: true });
	},

	deleteById(id: string) {
		return Task.findByIdAndDelete(id);
	},
};
