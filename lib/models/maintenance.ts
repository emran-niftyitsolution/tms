import mongoose, { Schema, model, models } from "mongoose";

const MaintenanceSchema = new Schema(
  {
    bus: {
      type: Schema.Types.ObjectId,
      ref: "Bus",
      required: [true, "Bus is required"],
    },
    type: {
      type: String,
      enum: ["Routine", "Repair", "Inspection", "Emergency", "Upgrade"],
      required: [true, "Maintenance type is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    cost: {
      type: Number,
      required: [true, "Cost is required"],
      min: 0,
    },
    serviceDate: {
      type: Date,
      required: [true, "Service date is required"],
    },
    nextServiceDate: {
      type: Date,
    },
    serviceProvider: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Scheduled", "InProgress", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Maintenance = models.Maintenance || model("Maintenance", MaintenanceSchema);


