import customerModel from "../customer/customer.model.js";
import expenseModel from "../expense/expense.model.js";
import incomeModel from "../income/income.model.js";
import inventoryLotsModel from "../inventoryLots/inventoryLots.model.js";
import purchaseModel from "../purchase/purchase.model.js";
import saleModel from "../sale/sale.model.js";
import supplierModel from "../supplier/supplier.model.js";

// @desc Dashboard Stats Calculation
// @access Private
const getDateFilter = (filter) => {
  const now = new Date();
  let start;

  switch (filter) {
    case "daily":
      start = new Date(now.setHours(0, 0, 0, 0));
      break;

    case "weekly":
      start = new Date(now.setDate(now.getDate() - 7));
      break;

    case "monthly":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;

    case "yearly":
      start = new Date(now.getFullYear(), 0, 1);
      break;

    default:
      start = new Date(now.setHours(0, 0, 0, 0));
  }

  return { createdAt: { $gte: start } };
};

export const getStats = async (filter) => {
  const dateQuery = getDateFilter(filter);

  // ----- FILTERED VALUES -----
  const totalPurchase = await purchaseModel.aggregate([
    { $match: dateQuery },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const totalSales = await saleModel.aggregate([
    { $match: dateQuery },
    {
      $group: {
        _id: null,
        total: { $sum: "$payment_details.payable_amount" },
      },
    },
  ]);

  const salesDue = await saleModel.aggregate([
    { $match: dateQuery },
    { $group: { _id: null, total: { $sum: "$payment_details.due_amount" } } },
  ]);

  const totalExpense = await expenseModel.aggregate([
    { $match: dateQuery },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const totalIncome = await incomeModel.aggregate([
    { $match: dateQuery },
    { $group: { _id: null, total: { $sum: "$total_Income" } } },
  ]);

  // ----- NON-FILTERED VALUES -----
  const totalActiveLots = await inventoryLotsModel.countDocuments({
    status: "in stock",
  });

  const totalCustomer = await customerModel.countDocuments();
  const totalSupplier = await supplierModel.countDocuments();

  return {
    filtered_by: filter,
    total_purchase: totalPurchase[0]?.total || 0,
    total_sales: totalSales[0]?.total || 0,
    sales_due: salesDue[0]?.total || 0,
    total_expense: totalExpense[0]?.total || 0,
    total_income: totalIncome[0]?.total,

    // Non-filtered
    total_active_lots: totalActiveLots,
    total_customer: totalCustomer,
    total_supplier: totalSupplier,
  };
};
