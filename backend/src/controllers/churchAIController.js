
const churchAIService = require("../services/churchAIService");

async function getContext(req, res) {
  try {
    const result = await churchAIService.getContext(
      req.body?.question,
      req.user
    );

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Church AI context error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Unable to retrieve authorized church information.",
    });
  }
}

module.exports = { getContext };
