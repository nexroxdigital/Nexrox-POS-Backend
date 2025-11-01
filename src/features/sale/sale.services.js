import mongoose from "mongoose";

import customerModel from "../customer/customer.model.js";
import incomeModel from "../income/income.model.js";
import inventoryLotsModel from "../inventoryLots/inventoryLots.model.js";
import Sale from "./sale.model.js";

// @desc Create sale a sale list + Update customer collection  ( caret info + due + balance ) Update inventory lots ( total sold + total sold kg + lotCommission + customerCommission ) + Create Income document
// @access  Admin
export const createSale = async (saleData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Create the sale
    const [sale] = await Sale.create([saleData], { session });

    // 2. Get customer data
    const customer = await customerModel
      .findById(saleData.customerId)
      .session(session);

    if (!customer) {
      throw new Error("Customer not found");
    }

    // 3. Calculate total crates used in this sale
    let totalCrateType1 = 0;
    let totalCrateType2 = 0;

    saleData.items.forEach((item) => {
      item.selected_lots.forEach((lot) => {
        totalCrateType1 += lot.crate_type1 || 0;
        totalCrateType2 += lot.crate_type2 || 0;
      });
    });

    // 4. Update customer data
    const updates = {};

    // Update balance (deduct received_amount_from_balance)
    const receivedFromBalance =
      saleData.payment_details.received_amount_from_balance || 0;
    updates["account_info.balance"] =
      customer.account_info.balance - receivedFromBalance;

    // Update due (add due_amount)
    const dueAmount = saleData.payment_details.due_amount || 0;
    updates["account_info.due"] = customer.account_info.due + dueAmount;

    // Update crates (subtract used crates, minimum 0)
    const newCrateType1 = customer.crate_info.type_1 - totalCrateType1;
    const newCrateType2 = customer.crate_info.type_2 - totalCrateType2;

    updates["crate_info.type_1"] = Math.max(0, newCrateType1);
    updates["crate_info.type_2"] = Math.max(0, newCrateType2);

    // 5. Apply updates to customer
    await customerModel.findByIdAndUpdate(
      saleData.customerId,
      { $set: updates },
      { session, new: true }
    );

    let lotIds = [];
    // 6. Update inventory lots
    for (const item of saleData.items) {
      for (const lot of item.selected_lots) {
        lotIds.push(lot.lotId);
        // Get current lot data
        const inventoryLot = await inventoryLotsModel
          .findById(lot.lotId)
          .session(session);

        if (!inventoryLot) {
          throw new Error(`InventoryLot not found: ${lot.lotId}`);
        }

        // Calculate increments for this lot
        const kgSold = lot.kg || 0;
        const soldPrice = lot.selling_price || 0;
        const lotCommission = lot.lot_commission_amount || 0;
        const customerCommission = item.customer_commission_amount || 0;

        // Prepare lot updates
        const lotUpdates = {
          // Increment sales
          "sales.totalKgSold": inventoryLot.sales.totalKgSold + kgSold,
          "sales.totalSoldPrice": inventoryLot.sales.totalSoldPrice + soldPrice,

          // Increment profits
          "profits.lotProfit": inventoryLot.profits.lotProfit + lotCommission,
          "profits.customerProfit":
            inventoryLot.profits.customerProfit + customerCommission,
          "profits.totalProfit":
            inventoryLot.profits.totalProfit +
            lotCommission +
            customerCommission,
        };

        // Apply updates to inventory lot
        await inventoryLotsModel.findByIdAndUpdate(
          lot.lotId,
          { $set: lotUpdates },
          { session, new: true }
        );
      }
    }

    // 7. Create Income document
    const incomeData = {
      sellDate: new Date(saleData.sale_date),
      information: {
        saleId: sale._id.toString(),
        lots_Ids: lotIds,
      },
      total_Sell: saleData.payment_details.payable_amount,
      lot_Commission: saleData.total_lots_commission,
      customer_Commission: saleData.total_custom_commission,

      total_Income: saleData.total_profit,

      received_amount: saleData.payment_details.received_amount || 0,
      received_amount_from_balance:
        saleData.payment_details.received_amount_from_balance || 0,
      due: saleData.payment_details.due_amount || 0,
    };

    await incomeModel.create([incomeData], { session });

    // 8. Commit transaction
    await session.commitTransaction();
    session.endSession();

    return sale;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// @desc    Get all sales
// @access  Admin
export const getAllSales = async (page, limit) => {
  const skip = (page - 1) * limit;
  const total = await Sale.countDocuments();

  const sales = await Sale.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate(
      "customerId",
      "basic_info.name contact_info.phone contact_info.email"
    )
    .populate({
      path: "items.productId",
      select: "productName basePrice categoryId",
      populate: {
        path: "categoryId",
        select: "categoryName",
      },
    })
    .populate("items.selected_lots.lotId", "lot_name commissionRate");

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    sales,
  };
};

// @desc    Get all sales
// @access  Admin
export const getAllSalesByCustomer = async (id) => {
  console.log(id);

  const sales = await Sale.find({ customerId: id })
    .sort({ createdAt: -1 })
    .populate(
      "customerId",
      "basic_info.name contact_info.phone contact_info.email"
    )
    .populate({
      path: "items.productId",
      select: "productName basePrice categoryId",
      populate: {
        path: "categoryId",
        select: "categoryName",
      },
    })
    .populate("items.selected_lots.lotId", "lot_name commissionRate");

  const total = sales.length;

  return {
    total,
    sales,
  };
  return {};
};

// @desc    Get sale details by ID
// @access  Admin
export const getSaleById = async (id) => {
  const sale = await Sale.findById(id)
    .populate(
      "customerId",
      "basic_info.name contact_info.phone contact_info.email"
    )
    .populate({
      path: "items.productId",
      select: "productName basePrice categoryId",
      populate: {
        path: "categoryId",
        select: "categoryName",
      },
    })
    .populate("items.selected_lots.lotId", "lot_name commissionRate");

  return sale;
};
