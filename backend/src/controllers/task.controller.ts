import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { updateTaskDto } from "../dto/task.dto";
import { taskService } from "../services/task.service";
import { getIO } from "../socket";
import { Task } from "../models/task.model";

/**
 * Create Task
 */
export const createTask = async (req: AuthRequest, res: Response) => {
	try {
		if (!req.user) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const { title, description, dueDate, priority } = req.body;

		if (!title || !dueDate || !priority) {
			return res.status(400).json({ message: "Missing required fields" });
		}

		const task = await Task.create({
			title,
			description,
			dueDate: new Date(dueDate),
			priority,
			status: "TODO",
			position: 0,

			// ✅ REQUIRED FIELDS
			creatorId: req.user.id,
			assignedToId: req.user.id,
		});

		const io = getIO();
		io.to(req.user.id).emit("task:created", task);

		res.status(201).json(task);
	} catch (error) {
		console.error("Create task error:", error);
		res.status(500).json({ message: "Failed to create task" });
	}
};

/**
 * Get Tasks
 */
export const getTasks = async (req: AuthRequest, res: Response) => {
	const tasks = await taskService.getTasks(req.user!.id, req.query);
	res.json(tasks);
};

/**
 * Update Task
 */
export const updateTask = async (req: AuthRequest, res: Response) => {
	const parsed = updateTaskDto.parse(req.body);

	const task = await taskService.updateTask(req.params.id, parsed);
	if (!task) {
		return res.status(404).json({ message: "Task not found" });
	}

	const io = getIO();
	io.to(task.assignedToId.toString()).emit("task:updated", task);

	res.json(task);
};

/**
 * Delete Task
 */
export const deleteTask = async (req: AuthRequest, res: Response) => {
	const task = await taskService.getTaskById(req.params.id);

	if (!task) {
		return res.status(404).json({ message: "Task not found" });
	}

	await taskService.deleteTask(req.params.id);

	const io = getIO();
	io.to(task.assignedToId.toString()).emit(
		"task:deleted",
		task._id.toString()
	);

	res.status(204).send();
};
