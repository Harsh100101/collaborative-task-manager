import { useState } from "react";
import { taskService } from "../api/task.service";

type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

interface Task {
	_id: string;
	title: string;
	description?: string;
	priority: TaskPriority;
	status: TaskStatus;
	dueDate: string;
}

interface Props {
	task: Task;
	onClose: () => void;
}

export default function TaskModal({ task, onClose }: Props) {
	const [title, setTitle] = useState(task.title);
	const [description, setDescription] = useState(task.description || "");
	const [priority, setPriority] = useState<TaskPriority>(task.priority);
	const [status, setStatus] = useState(task.status);
	const [dueDate, setDueDate] = useState(task.dueDate.slice(0, 10));
	const [loading, setLoading] = useState(false);

	const handleSave = async () => {
		setLoading(true);
		try {
			await taskService.updateTask(task._id, {
				title,
				description,
				priority,
				status,
				dueDate: new Date(dueDate).toISOString(),
			});
			onClose(); // socket updates dashboard
		} catch (err) {
			console.error("Update failed", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/60 flex items-center justify-center">
			<div className="bg-gray-900 p-6 rounded w-full max-w-lg">
				<h2 className="mb-4 font-semibold">Edit Task</h2>

				<input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="w-full mb-3 bg-gray-800 p-2 rounded"
				/>

				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className="w-full mb-3 bg-gray-800 p-2 rounded"
				/>

				<div className="grid grid-cols-2 gap-3 mb-3">
					<select
						value={priority}
						onChange={(e) =>
							setPriority(e.target.value as TaskPriority)
						}
						className="bg-gray-800 p-2 rounded"
					>
						<option>LOW</option>
						<option>MEDIUM</option>
						<option>HIGH</option>
						<option>URGENT</option>
					</select>

					<select
						value={status}
						onChange={(e) =>
							setStatus(e.target.value as TaskStatus)
						}
						className="bg-gray-800 p-2 rounded"
					>
						<option>TODO</option>
						<option>IN_PROGRESS</option>
						<option>REVIEW</option>
						<option>COMPLETED</option>
					</select>
				</div>

				<input
					type="date"
					value={dueDate}
					onChange={(e) => setDueDate(e.target.value)}
					className="w-full bg-gray-800 p-2 rounded mb-4"
				/>

				<div className="flex justify-end gap-3">
					<button onClick={onClose}>Cancel</button>
					<button
						onClick={handleSave}
						disabled={loading}
						className="bg-blue-600 px-4 py-2 rounded"
					>
						{loading ? "Saving..." : "Save"}
					</button>
				</div>
			</div>
		</div>
	);
}
