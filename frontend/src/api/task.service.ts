import api from "./axios";

export const taskService = {
	getTasks: () => api.get("/tasks"),

	createTask: (data: {
		title: string;
		description?: string;
		dueDate: string;
		priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
	}) => {
		return api.post("/tasks", {
			title: data.title,
			description: data.description,
			dueDate: data.dueDate,
			priority: data.priority,
		});
	},
	updateTaskStatus: (
		id: string,
		status: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED"
	) => api.patch(`/tasks/${id}`, { status }),

	deleteTask: (id: string) => api.delete(`/tasks/${id}`),

	updateTask: (
		id: string,
		data: {
			title?: string;
			description?: string;
			status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
			priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
			dueDate?: string;
			position?: number; 
		}
	) => api.patch(`/tasks/${id}`, data),
};
