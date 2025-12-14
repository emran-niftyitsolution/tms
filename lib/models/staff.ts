import mongoose, { Schema, model, models } from "mongoose";

const StaffSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["Driver", "Helper", "Supervisor", "Guide"],
      required: [true, "Role is required"],
    },
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
    },
    licenseNumber: {
      type: String,
      trim: true,
    },
    nid: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "OnLeave"],
      default: "Active",
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
    },
  },
  {
    timestamps: true,
  }
);

export const Staff = models.Staff || model("Staff", StaffSchema);


