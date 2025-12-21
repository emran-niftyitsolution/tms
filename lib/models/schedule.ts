import mongoose, { Schema, model, models } from "mongoose";

const ScheduleSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
    },
    bus: {
      type: Schema.Types.ObjectId,
      ref: "Bus",
      required: [true, "Bus is required"],
    },
    route: {
      type: Schema.Types.ObjectId,
      ref: "Route",
      required: [true, "Route is required"],
    },
    departureTime: {
      type: Date,
      required: [true, "Departure time is required"],
    },
    arrivalTime: {
      type: Date,
      required: [true, "Arrival time is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Delayed", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    seats: {
      type: [
        {
          row: Number,
          column: Number,
          seatNumber: Number,
          seatName: String,
          isBroken: Boolean,
          isAisle: Boolean,
          fare: Number, // Individual seat fare
        },
      ],
      default: [],
    },
    showOnWeb: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Schedule = models.Schedule || model("Schedule", ScheduleSchema);


