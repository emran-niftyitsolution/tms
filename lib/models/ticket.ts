import mongoose, { Schema, model, models } from "mongoose";

// Delete existing model to prevent schema caching issues
delete models.Ticket;

const TicketSchema = new Schema(
  {
    schedule: {
      type: Schema.Types.ObjectId,
      ref: "Schedule",
      required: [true, "Schedule is required"],
    },
    passengerName: {
      type: String,
      required: [true, "Passenger name is required"],
      trim: true,
    },
    passengerPhone: {
      type: String,
      required: [true, "Passenger phone is required"],
      trim: true,
    },
    passengerEmail: {
      type: String,
      trim: true,
    },
    passengerNID: {
      type: String,
      trim: true,
    },
    seats: {
      type: [
        {
          row: { type: Number, required: true },
          column: { type: Number, required: true },
          seatNumber: { type: Number, required: true },
          seatName: { type: String },
          fare: { type: Number, required: true, min: 0 },
        },
      ],
      required: true,
      validate: {
        validator: (v: any) => Array.isArray(v) && v.length > 0,
        message: "At least one seat is required",
      },
    },
    totalFare: {
      type: Number,
      required: [true, "Total fare is required"],
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    finalAmount: {
      type: Number,
      required: [true, "Final amount is required"],
      min: 0,
    },
    boardingPoint: {
      type: Schema.Types.ObjectId,
      ref: "Stoppage",
    },
    droppingPoint: {
      type: Schema.Types.ObjectId,
      ref: "Stoppage",
    },
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Confirmed",
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Ticket = models.Ticket || model("Ticket", TicketSchema);

