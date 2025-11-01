import mongoose from "mongoose";

const inventoryLotsSchema = new mongoose.Schema(
  {
    // Basic Info
    lot_name: {
      type: String,
      required: true,
    },
    purchase_date: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["in stock", "stock out"],
      default: "in stock",
    },

    hasCommission: {
      type: Boolean,
      default: false,
    },

    // Relations
    productsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },

    purchaseListId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purchase",
      required: true,
    },

    // Carat Details
    carat: {
      carat_Type_1: {
        type: Number,
        default: 0,
      },
      carat_Type_2: {
        type: Number,
        default: 0,
      },
    },

    costs: {
      unitCost: {
        type: Number,
        required: true,
      },

      commissionRate: {
        type: Number,
        default: 0,
      },
    },

    sales: {
      totalKgSold: {
        type: Number,
        default: 0,
      },
      totalSoldPrice: {
        type: Number,
        default: 0,
      },
    },

    profits: {
      lotProfit: {
        type: Number,
        default: 0,
      },

      customerProfit: {
        type: Number,
        default: 0,
      },

      totalProfit: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("InventoryLot", inventoryLotsSchema);
