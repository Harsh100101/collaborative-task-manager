import { socket } from "../api/socket";
import type { DragStartEvent, DragOverEvent } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { taskService } from "../api/task.service";
import TaskModal from "../components/TaskModal";
import {
	DndContext,
	useDroppable,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
	closestCenter,
	DragOverlay,
} from "@dnd-kit/core";

import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
	arrayMove,
} from "@dnd-kit/sortable";

interface Task {
	_id: string;
	title: string;
	description?: string;
	status: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
	priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
	dueDate: string;
	createdAt: string;
	assignedToId: string;
	position: number;
}

function DroppableColumn({
	id,
	children,
}: {
	id: string;
	children: React.ReactNode;
}) {
	const { setNodeRef, isOver } = useDroppable({ id });

	return (
		<div
			ref={setNodeRef}
			className={`space-y-3 min-h-[120px] p-2 rounded transition-colors
				${
					isOver
						? "bg-blue-900/30 border-2 border-blue-500"
						: "border-2 border-transparent"
				}
			`}
		>
			{children}
		</div>
	);
}

function DraggableTask({
	id,
	children,
}: {
	id: string;
	children: React.ReactNode;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id });

	const style = {
		transform: transform
			? `translate3d(${transform.x}px, ${transform.y}px, 0)`
			: undefined,
		transition,
	};

	return (
		<div ref={setNodeRef} style={style} className="bg-gray-900 rounded p-3">
			{/* Drag Handle */}
			<div
				{...listeners}
				{...attributes}
				className="text-xs text-gray-400 cursor-move mb-1 select-none"
			>
				☰ Drag
			</div>

			{children}
		</div>
	);
}

export default function Dashboard() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const [tasks, setTasks] = useState<Task[]>([]);
	const [newTask, setNewTask] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [priority, setPriority] = useState<Task["priority"]>("MEDIUM");
	const [loading, setLoading] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [activeTask, setActiveTask] = useState<Task | null>(null);

	const [priorityFilter, setPriorityFilter] = useState<
		Task["priority"] | "ALL"
	>("ALL");

	const [dueFilter, setDueFilter] = useState<
		"ALL" | "OVERDUE" | "TODAY" | "FUTURE"
	>("ALL");

	useEffect(() => {
		const fetchTasks = async () => {
			const res = await taskService.getTasks();
			setTasks(res.data);
		};
		fetchTasks();
	}, []);

	useEffect(() => {
		socket.on("task:created", (task) => {
			setTasks((prev) => {
				// 🔐 Prevent duplicate task
				if (prev.some((t) => t._id === task._id)) {
					return prev;
				}
				return [task, ...prev];
			});
		});

		socket.on("task:updated", (task) => {
			setTasks((prev) =>
				prev.map((t) => (t._id === task._id ? task : t))
			);
		});

		socket.on("task:deleted", (taskId) => {
			setTasks((prev) => prev.filter((t) => t._id !== taskId));
		});

		return () => {
			socket.off("task:created");
			socket.off("task:updated");
			socket.off("task:deleted");
		};
	}, []);

	// 🔌 Socket connection
	useEffect(() => {
		if (!user) return;

		if (!socket.connected) {
			socket.connect();
			socket.emit("join:user", user.id);
			console.log("🔌 Socket connected for user:", user.id);
		}

		return () => {
			socket.disconnect(); // ✅ full cleanup on unmount
		};
	}, [user]);

	// Logout handler
	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	// Create task
	const handleCreateTask = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!newTask.trim() || !dueDate || !user) return;

		setLoading(true);
		try {
			await taskService.createTask({
				title: newTask.trim(),
				description: "",
				dueDate: new Date(dueDate).toISOString(),
				priority,
			});

			setNewTask("");
			setDueDate("");
			setPriority("MEDIUM");
		} catch (err) {
			console.error("Failed to create task", err);
		} finally {
			setLoading(false);
		}
	};

	// Delete Task
	const handleDeleteTask = async (taskId: string) => {
		try {
			await taskService.deleteTask(taskId);

			// Remove task from UI instantly
			setTasks((prev) => prev.filter((task) => task._id !== taskId));
		} catch (err) {
			console.error("Failed to delete task", err);
		}
	};

	// Update task status
	const handleStatusChange = async (
		taskId: string,
		status: Task["status"]
	) => {
		try {
			const res = await taskService.updateTaskStatus(taskId, status);
			setTasks((prev) =>
				prev.map((task) => (task._id === taskId ? res.data : task))
			);
		} catch (err) {
			console.error("Failed to update task status", err);
		}
	};

	const handlePriorityChange = async (
		taskId: string,
		priority: Task["priority"]
	) => {
		try {
			const res = await taskService.updateTask(taskId, { priority });

			setTasks((prev) =>
				prev.map((task) => (task._id === taskId ? res.data : task))
			);
		} catch (err) {
			console.error("Failed to update priority", err);
		}
	};

	const priorityRank: Record<Task["priority"], number> = {
		URGENT: 1,
		HIGH: 2,
		MEDIUM: 3,
		LOW: 4,
	};

	const dueDateRank = (dueDate: string) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const due = new Date(dueDate);
		due.setHours(0, 0, 0, 0);

		if (due < today) return 1; // overdue
		if (due.getTime() === today.getTime()) return 2; // due today
		return 3; // future
	};

	const sortByDueDateAndPriority = (list: Task[]) =>
		[...list].sort((a, b) => {
			const dueDiff = dueDateRank(a.dueDate) - dueDateRank(b.dueDate);
			if (dueDiff !== 0) return dueDiff;

			return priorityRank[a.priority] - priorityRank[b.priority];
		});

	const applyFilters = (list: Task[]) => {
		return list.filter((task) => {
			// 🔍 Search filter
			if (
				searchTerm &&
				!task.title.toLowerCase().includes(searchTerm.toLowerCase())
			) {
				return false;
			}

			// 🎯 Priority filter
			if (priorityFilter !== "ALL" && task.priority !== priorityFilter) {
				return false;
			}

			// 📅 Due-date filter
			const rank = dueDateRank(task.dueDate);
			if (dueFilter === "OVERDUE" && rank !== 1) return false;
			if (dueFilter === "TODAY" && rank !== 2) return false;
			if (dueFilter === "FUTURE" && rank !== 3) return false;

			return true;
		});
	};

	// group tasks by status
	const groupedTasks = {
		TODO: sortByDueDateAndPriority(
			applyFilters(tasks.filter((t) => t.status === "TODO"))
		),
		IN_PROGRESS: sortByDueDateAndPriority(
			applyFilters(tasks.filter((t) => t.status === "IN_PROGRESS"))
		),
		REVIEW: sortByDueDateAndPriority(
			applyFilters(tasks.filter((t) => t.status === "REVIEW"))
		),
		COMPLETED: sortByDueDateAndPriority(
			applyFilters(tasks.filter((t) => t.status === "COMPLETED"))
		),
	};

	// OverDue
	const isOverdue = (dueDate: string) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const due = new Date(dueDate);
		due.setHours(0, 0, 0, 0);

		return due < today;
	};

	// DueDate
	const isDueToday = (dueDate: string) => {
		const today = new Date();
		const due = new Date(dueDate);

		return (
			today.getDate() === due.getDate() &&
			today.getMonth() === due.getMonth() &&
			today.getFullYear() === due.getFullYear()
		);
	};
	const openTaskModal = (task: Task) => {
		setSelectedTask(task);
		setIsModalOpen(true);
	};

	const closeTaskModal = () => {
		setSelectedTask(null);
		setIsModalOpen(false);
	};

	const priorityColor = (priority: Task["priority"]) => {
		switch (priority) {
			case "LOW":
				return "bg-gray-600 text-white";
			case "MEDIUM":
				return "bg-blue-600 text-white";
			case "HIGH":
				return "bg-orange-600 text-white";
			case "URGENT":
				return "bg-red-600 text-white";
			default:
				return "bg-gray-600 text-white";
		}
	};

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveTask(null);

		if (!over) return;

		const activeId = active.id as string;
		const overId = over.id as string;

		if (activeId === overId) return;

		const activeTask = tasks.find((t) => t._id === activeId);
		if (!activeTask) return;

		const overTask = tasks.find((t) => t._id === overId);

		/* ===============================
	   1️⃣ SAME COLUMN → REORDER
	================================ */
		if (overTask && activeTask.status === overTask.status) {
			setTasks((prev) => {
				const columnTasks = prev.filter(
					(t) => t.status === activeTask.status
				);

				const oldIndex = columnTasks.findIndex(
					(t) => t._id === activeId
				);
				const newIndex = columnTasks.findIndex((t) => t._id === overId);

				const reordered = arrayMove(
					columnTasks,
					oldIndex,
					newIndex
				).map((t, i) => ({ ...t, position: i }));

				// persist order (fire & forget)
				reordered.forEach((t) => {
					taskService.updateTask(t._id, { position: t.position });
				});

				return prev.map((t) =>
					t.status === activeTask.status
						? reordered.find((r) => r._id === t._id) || t
						: t
				);
			});

			return; // ⛔ important: stop here
		}

		/* ===============================
	   2️⃣ MOVE TO DIFFERENT COLUMN
	================================ */
		const targetStatus = overTask
			? overTask.status
			: (overId as Task["status"]);

		if (
			["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"].includes(
				targetStatus
			) &&
			activeTask.status !== targetStatus
		) {
			// optimistic UI
			setTasks((prev) =>
				prev.map((t) =>
					t._id === activeId ? { ...t, status: targetStatus } : t
				)
			);

			// persist
			await taskService.updateTaskStatus(activeId, targetStatus);
		}
	};

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 8 },
		}),
		useSensor(TouchSensor, {
			activationConstraint: { delay: 200, tolerance: 5 },
		})
	);

	const handleDragStart = (event: DragStartEvent) => {
		const task = tasks.find((t) => t._id === event.active.id);
		if (task) setActiveTask(task);
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event;
		if (!over) return;

		const activeId = active.id as string;
		const overId = over.id as string;

		const task = tasks.find((t) => t._id === activeId);
		if (!task) return;

		if (["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"].includes(overId)) {
			if (task.status !== overId) {
				setTasks((prev) =>
					prev.map((t) =>
						t._id === activeId
							? { ...t, status: overId as Task["status"] }
							: t
					)
				);
			}
		}
	};

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			{/* Top Bar */}
			<div className="flex justify-between items-center p-4 bg-gray-800">
				<h1 className="text-xl font-bold">AbleSpace Dashboard</h1>

				<div className="flex items-center gap-4">
					<span className="text-sm text-gray-300">
						{user?.name} ({user?.email})
					</span>
					<button
						onClick={handleLogout}
						className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
					>
						Logout
					</button>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-3xl mx-auto p-6">
				{/* Create Task */}
				<form
					onSubmit={handleCreateTask}
					className="flex flex-col sm:flex-row gap-2 mb-6"
				>
					<input
						type="text"
						placeholder="Enter a new task..."
						value={newTask}
						onChange={(e) => setNewTask(e.target.value)}
						className="flex-1 px-4 py-2 rounded bg-gray-800 border border-gray-700"
					/>

					<input
						type="date"
						value={dueDate}
						onChange={(e) => setDueDate(e.target.value)}
						className="px-3 py-2 rounded bg-gray-800 border border-gray-700"
					/>
					<select
						value={priority}
						onChange={(e) =>
							setPriority(e.target.value as Task["priority"])
						}
						className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-sm"
					>
						<option value="LOW">LOW</option>
						<option value="MEDIUM">MEDIUM</option>
						<option value="HIGH">HIGH</option>
						<option value="URGENT">URGENT</option>
					</select>

					<button
						type="submit"
						disabled={loading}
						className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
					>
						{loading ? "Adding..." : "Add"}
					</button>
				</form>

				<div className="flex flex-wrap gap-3 mb-4">
					<input
						type="text"
						placeholder="Search tasks..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full sm:w-64 bg-gray-800 border border-gray-700 px-3 py-2 rounded text-sm"
					/>

					{/* Priority Filter */}
					<select
						value={priorityFilter}
						onChange={(e) =>
							setPriorityFilter(
								e.target.value as Task["priority"] | "ALL"
							)
						}
						className="bg-gray-800 border border-gray-700 px-3 py-2 rounded text-sm"
					>
						<option value="ALL">All Priorities</option>
						<option value="LOW">LOW</option>
						<option value="MEDIUM">MEDIUM</option>
						<option value="HIGH">HIGH</option>
						<option value="URGENT">URGENT</option>
					</select>

					{/* Due Date Filter */}
					<select
						value={dueFilter}
						onChange={(e) =>
							setDueFilter(
								e.target.value as
									| "ALL"
									| "OVERDUE"
									| "TODAY"
									| "FUTURE"
							)
						}
						className="bg-gray-800 border border-gray-700 px-3 py-2 rounded text-sm"
					>
						<option value="ALL">All Due Dates</option>
						<option value="OVERDUE">Overdue</option>
						<option value="TODAY">Due Today</option>
						<option value="FUTURE">Upcoming</option>
					</select>

					{/* Reset */}
					<button
						onClick={() => {
							setPriorityFilter("ALL");
							setDueFilter("ALL");
						}}
						className="text-sm px-3 py-2 rounded bg-gray-700 hover:bg-gray-600"
					>
						Reset Filters
					</button>
				</div>

				{/* Tasks List */}
				{/* Kanban Board */}
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragStart={handleDragStart}
					onDragOver={handleDragOver}
					onDragEnd={handleDragEnd}
				>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
						{(
							[
								{ key: "TODO", title: "TODO" },
								{ key: "IN_PROGRESS", title: "IN PROGRESS" },
								{ key: "REVIEW", title: "REVIEW" },
								{ key: "COMPLETED", title: "COMPLETED" },
							] as const
						).map((column) => (
							<div
								key={column.key}
								className="bg-gray-800 rounded p-3"
							>
								<h3 className="text-sm font-semibold text-gray-300 mb-3">
									{column.title}
								</h3>

								<DroppableColumn id={column.key}>
									<SortableContext
										items={groupedTasks[column.key].map(
											(t) => t._id
										)}
										strategy={verticalListSortingStrategy}
									>
										{groupedTasks[column.key].length ===
										0 ? (
											<p className="text-xs text-gray-500">
												No tasks
											</p>
										) : (
											groupedTasks[column.key].map(
												(task) => (
													<DraggableTask
														key={task._id}
														id={task._id}
													>
														<p
															onClick={() =>
																openTaskModal(
																	task
																)
															}
															className={`cursor-pointer hover:underline text-sm mb-2 ${
																task.status ===
																"COMPLETED"
																	? "line-through text-gray-500"
																	: "text-white"
															}`}
														>
															{task.title}
														</p>

														{/* Due date badge */}
														<div className="flex items-center gap-2 mt-1">
															{/* Due date badge */}
															{task.status !==
																"COMPLETED" && (
																<span
																	className={`text-xs px-2 py-0.5 rounded ${
																		isOverdue(
																			task.dueDate
																		)
																			? "bg-red-600 text-white"
																			: isDueToday(
																					task.dueDate
																			  )
																			? "bg-yellow-500 text-black"
																			: "bg-gray-700 text-gray-300"
																	}`}
																>
																	{isOverdue(
																		task.dueDate
																	)
																		? "Overdue"
																		: isDueToday(
																				task.dueDate
																		  )
																		? "Due Today"
																		: `Due ${new Date(
																				task.dueDate
																		  ).toLocaleDateString()}`}
																</span>
															)}

															{/* Priority badge */}
															<span
																className={`text-xs px-2 py-0.5 rounded ${priorityColor(
																	task.priority
																)}`}
															>
																{task.priority}
															</span>
														</div>

														{/* Actions */}
														<div className="flex items-center justify-between gap-2 mt-2">
															{/* Status dropdown */}
															<select
																value={
																	task.status
																}
																onChange={(e) =>
																	handleStatusChange(
																		task._id,
																		e.target
																			.value as Task["status"]
																	)
																}
																className="bg-gray-700 text-white text-xs px-2 py-1 rounded"
															>
																<option value="TODO">
																	TODO
																</option>
																<option value="IN_PROGRESS">
																	IN PROGRESS
																</option>
																<option value="REVIEW">
																	REVIEW
																</option>
																<option value="COMPLETED">
																	COMPLETED
																</option>
															</select>

															{/* Priority dropdown */}
															<select
																value={
																	task.priority
																}
																onChange={(e) =>
																	handlePriorityChange(
																		task._id,
																		e.target
																			.value as Task["priority"]
																	)
																}
																className="bg-gray-700 text-white text-xs px-2 py-1 rounded"
															>
																<option value="LOW">
																	LOW
																</option>
																<option value="MEDIUM">
																	MEDIUM
																</option>
																<option value="HIGH">
																	HIGH
																</option>
																<option value="URGENT">
																	URGENT
																</option>
															</select>

															<button
																onClick={() =>
																	handleDeleteTask(
																		task._id
																	)
																}
																className="text-red-400 hover:text-red-500 text-xs"
															>
																Delete
															</button>
														</div>
													</DraggableTask>
												)
											)
										)}
									</SortableContext>
								</DroppableColumn>
							</div>
						))}
					</div>
					<DragOverlay>
						{activeTask ? (
							<div className="bg-gray-900 rounded p-3 shadow-xl opacity-95">
								<p className="text-sm font-medium">
									{activeTask.title}
								</p>

								<div className="flex gap-2 mt-1">
									<span
										className={`text-xs px-2 py-0.5 rounded ${priorityColor(
											activeTask.priority
										)}`}
									>
										{activeTask.priority}
									</span>
								</div>
							</div>
						) : null}
					</DragOverlay>
				</DndContext>
			</div>

			{/* Task Modal */}
			{isModalOpen && selectedTask && (
				<TaskModal task={selectedTask} onClose={closeTaskModal} />
			)}
		</div>
	);
}
