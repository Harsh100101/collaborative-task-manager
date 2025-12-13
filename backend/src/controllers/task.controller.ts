import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { createTaskDto, updateTaskDto } from "../dto/task.dto";
import { taskService } from "../services/task.service";

export const createTask = async (req: AuthRequest, res: Response) => {
	try {
		const parsed = createTaskDto.parse(req.body);

		const task = await taskService.createTask(
			{
				...parsed,
				dueDate: new Date(parsed.dueDate),
			},
			req.user!.id // 🔐 creatorId from JWT
		);

		res.status(201).json(task);
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
};

export const getTasks = async (req: AuthRequest, res: Response) => {
	const tasks = await taskService.getTasks(req.user!.id, req.query);
	res.json(tasks);
};

export const updateTask = async (req: AuthRequest, res: Response) => {
	const parsed = updateTaskDto.parse(req.body);
	const task = await taskService.updateTask(req.params.id, parsed);
	res.json(task);
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
	await taskService.deleteTask(req.params.id);
	res.status(204).send();
};
