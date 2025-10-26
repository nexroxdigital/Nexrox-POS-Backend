import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    // Basic Information
    basic_info: {
      sl: {
        type: String,
        required: true,
        trim: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      avatar: {
        type: String,
        default: "",
        trim: true,
      },
      role: {
        type: String,
        default: "supplier",
        enum: ["supplier"], // restricts to supplier role
      },
    },

    // Contact Information
    contact_info: {
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      location: {
        type: String,
        trim: true,
        default: "",
      },
    },

    // Account & Balance
    account_info: {
      accountNumber: {
        type: String,
        trim: true,
        default: "",
      },
      balance: {
        type: Number,
        default: 0,
      },
      due: {
        type: Number,
        default: 0,
      },
      cost: {
        type: Number,
        default: 0,
      },
    },

    // Crate Tracking
    crate_info: {
      crate1: {
        type: Number,
        default: 0,
      },
      crate1Price: {
        type: Number,
        default: 0,
      },
      remainingCrate1: {
        type: Number,
        default: 0,
      },

      // Crate 2 Info
      crate2: {
        type: Number,
        default: 0,
      },
      crate2Price: {
        type: Number,
        default: 0,
      },
      remainingCrate2: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Supplier", supplierSchema);
