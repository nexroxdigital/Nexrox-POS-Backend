import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
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
      role: {
        type: String,
        enum: ["customer"],
        default: "customer",
      },
      avatar: {
        type: String,
        default: "",
      },
    },

    // Contact Information
    contact_info: {
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      location: {
        type: String,
        default: "",
      },
    },

    // Account & Balance
    account_info: {
      account_number: {
        type: String,
        default: "",
      },
      balance: {
        type: Number,
        default: 0,
      },
      dua: {
        type: Number,
        default: 0,
      },
      return_amount: {
        type: Number,
        default: 0,
      },
    },

    // Crate Tracking
    crate_info: {
      type_1: {
        type: Number,
        default: 0,
      },
      type_1_price: {
        type: Number,
        default: 0,
      },
      type_2: {
        type: Number,
        default: 0,
      },
      type_2_price: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    collection: "customers",
  }
);

export default mongoose.model("Customer", customerSchema);
