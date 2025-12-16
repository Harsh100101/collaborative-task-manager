import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
	title: string;
	description?: string;
	status: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
	priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
	dueDate: Date;
	creatorId: mongoose.Types.ObjectId;
	assignedToId: mongoose.Types.ObjectId;
	position: number;
	createdAt: Date;
	updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
	{
		title: { type: String, required: true, maxlength: 100 },
		description: { type: String },
		dueDate: { type: Date, required: true },
		priority: {
			type: String,
			enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
			default: "MEDIUM",
		},
		status: {
			type: String,
			enum: ["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"],
			default: "TODO",
		},
		creatorId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		assignedToId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		position: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

export const Task = mongoose.model<ITask>("Task", TaskSchema);
