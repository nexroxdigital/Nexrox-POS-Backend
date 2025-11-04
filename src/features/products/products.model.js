import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      trim: true,
    },

    basePrice: {
      type: Number,
      min: 0,
    },

    productImage: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    commissionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    allowCommission: {
      type: Boolean,
      default: false,
    },

    isCrated: {
      type: Boolean,
      default: false,
    },

    isBoxed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
