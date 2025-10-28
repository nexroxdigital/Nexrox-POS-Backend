import * as purchaseService from "./purchase.service.js";

// Create Purchase
export const createPurchase = async (req, res) => {
  try {
    const purchase = await purchaseService.createPurchase(req.body);
    res.status(201).json({
      success: true,
      message: "Purchase created successfully",
      data: purchase,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Purchases
export const getAllPurchases = async (req, res) => {
  try {
    const purchases = await purchaseService.getAllPurchases();
    res.status(200).json({
      success: true,
      count: purchases.length,
      data: purchases,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Purchase Details
export const getPurchaseById = async (req, res) => {
  try {
    const purchase = await purchaseService.getPurchaseById(req.params.id);
    if (!purchase) {
      return res
        .status(404)
        .json({ success: false, message: "Purchase not found" });
    }
    res.status(200).json({ success: true, data: purchase });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Purchase
export const updatePurchase = async (req, res) => {
  try {
    const updatedPurchase = await purchaseService.updatePurchase(
      req.params.id,
      req.body
    );
    if (!updatedPurchase) {
      return res
        .status(404)
        .json({ success: false, message: "Purchase not found" });
    }
    res.status(200).json({
      success: true,
      message: "Purchase updated successfully",
      data: updatedPurchase,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

