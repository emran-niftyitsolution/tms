import { Schema, model, models } from "mongoose";

const SeatPlanSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
    },
    name: {
      type: String,
      required: [true, "Plan name is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["AC", "Non-AC", "Sleeper", "Seater", "Double Decker"],
      required: [true, "Bus type is required"],
    },
    rows: {
      type: Number,
      default: 10,
    },
    columns: {
      type: Number,
      default: 5,
    },
    aisleColumns: {
      type: [Number], // Column indices that are aisles (0-based)
      default: [],
    },
    rowNames: {
      type: Schema.Types.Mixed, // Object mapping row index (0-based) to custom row name
      default: {},
    },
    seats: {
      type: [
        {
          row: { type: Number, required: true },
          column: { type: Number, required: true },
          seatNumber: { type: Number, required: true },
          seatName: { type: String }, // Custom name for the seat (e.g., "A1", "Window-1")
          isBroken: { type: Boolean, default: false },
          isAisle: { type: Boolean, default: false }, // If true, this seat is a road (walkway)
        },
      ],
      default: [],
    },
    // Keep these for backward compatibility, but make them optional
    layout: {
      type: String,
      enum: ["2+2", "2+1", "1+2", "1+1"],
    },
    totalSeats: {
      type: Number,
    },
    gapRows: {
      type: [Number],
      default: [],
    },
    lastRowSeats: {
      type: Number,
      default: 5,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

export const SeatPlan = models.SeatPlan || model("SeatPlan", SeatPlanSchema);
