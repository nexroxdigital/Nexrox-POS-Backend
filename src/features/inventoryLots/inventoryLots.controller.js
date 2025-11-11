import * as inventoryLotsService from "./inventoryLots.services.js";

// @desc create lost from purchase list
// @route   POST /api/v1/inventoryLots/add
// @access  Admin
export const createLots = async (req, res) => {
  try {
    const purchaseId = req.query.id;

    const lotsCreatedCount =
      await inventoryLotsService.createLotsForPurchase(purchaseId);

    return res.status(200).json({
      success: true,
      message: `Successfully created ${lotsCreatedCount} lots.`,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// @desc Get all lots
// @route   GET /api/v1/inventoryLots/all
// @access  Admin
export const fetchAllLots = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const lots = await inventoryLotsService.getAllLots(
      parseInt(page),
      parseInt(limit)
    );
    return res.status(200).json({ lots });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc Get all lots by supplier
// @route   GET /api/v1/inventoryLots/by-supplier
// @access  Admin
export const lotsBySupplier = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, fromDate, toDate } = req.query;

    const lots = await inventoryLotsService.getAllLotsBySupplier(
      req.params.id,
      parseInt(page),
      parseInt(limit),
      { search, fromDate, toDate }
    );

    res.status(200).json({
      success: true,
      ...lots,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single lot details
// @route   GET /api/v1/inventoryLots/details
// @access  Admin
export const fetchLotDetails = async (req, res) => {
  try {
    const lotId = req.params.id;
    const lot = await inventoryLotsService.getLotById(lotId);
    return res.status(200).json({ lot });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

// Update lot status
// @route   GET /api/v1/inventoryLots/details
// @access  Admins
export const updateLotStatusController = async (req, res) => {
  try {
    const lotId = req.params.id;
    const { status } = req.body; // expecting { "status": "stock out" }

    const updatedLot = await inventoryLotsService.updateLotStatus(
      lotId,
      status
    );

    return res.status(200).json({
      message: "Lot status updated successfully",
      lot: updatedLot,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Controller to get all in-stock loots
// @route   GET /api/v1/inventoryLots/in-stock
// @access  Admins
export const getAllInStockLots = async (req, res) => {
  try {
    const lots = await inventoryLotsService.getAllInStockLots();

    res.status(200).json({
      success: true,
      count: lots.length,
      data: lots,
    });
  } catch (error) {
    console.error("Error in getAllInStockLots:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch in-stock lots",
    });
  }
};

// @desc    Get all unpaid & out-of-stock lots
// @route   GET /api/v1/inventory-lots/unpaid-stock-out
// @access  Admin
export const getUnpaidAndOutOfStockLots = async (req, res) => {
  try {
    const lots = await inventoryLotsService.getUnpaidAndOutOfStockLots();
    res.status(200).json({
      success: true,
      count: lots.length,
      data: lots,
    });
  } catch (error) {
    next(error);
  }
};
