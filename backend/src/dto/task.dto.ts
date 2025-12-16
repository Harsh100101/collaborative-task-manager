import { z } from "zod";

export const createTaskDto = z.object({
	title: z.string().max(100),
	description: z.string().optional(),
	dueDate: z.string(),
	priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
	assignedToId: z.string(),
	workspaceId: z.string(),
});

export const updateTaskDto = z.object({
	title: z.string().max(100).optional(),
	description: z.string().optional(),
	dueDate: z.coerce.date().optional(),
	status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"]).optional(),
	priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
	assignedToId: z.string().optional(),
	position: z.number().optional(),
});
