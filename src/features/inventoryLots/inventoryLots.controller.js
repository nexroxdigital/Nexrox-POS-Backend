import * as inventoryLotsService from "./inventoryLots.services.js";

// @desc create lost from purchase list
// @route   POST /api/v1/inventoryLots/add
// @access  Admin
export const createLots = async (req, res) => {
  try {
    const purchaseId = req.query.id;
    console.log(purchaseId);

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
// @route   GET /api/v1/inventoryLots/all
// @access  Admin
export const lotsBySupplier = async (req, res) => {
  try {
    const lots = await inventoryLotsService.getAllLotsBySupplier(req.params.id);

    res.status(200).json({
      success: true,
      data: lots,
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
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

// Controller to check duplicate lot name
// @route   GET /api/v1/inventoryLots/check-name
// @access  Admins
export const checkDuplicateLotName = async (req, res) => {
  try {
    // Get lot_name from query instead of body
    const lot_name = req.query.lot_name;
    console.log(lot_name);

    if (!lot_name) {
      return res.status(400).json({
        success: false,
        message: "Lot name is required",
      });
    }

    const exists = await inventoryLotsService.isLotNameDuplicate(lot_name);

    res.status(200).json({
      success: true,
      lot_name,
      isDuplicate: exists,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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
