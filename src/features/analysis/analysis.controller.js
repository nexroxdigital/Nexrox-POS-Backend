import * as analysisService from "./analysis.services.js";

// @desc    Get dashboard statistics
// @route   GET /api/v1/dashboard/stats?filter=daily
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const filter = req.query.filter || "daily"; // default daily

    const stats = await analysisService.getStats(filter);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
