import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user", "admin", "manager", "operator", "staff"],
      default: "user",
      required: true,
    },

    salary: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
