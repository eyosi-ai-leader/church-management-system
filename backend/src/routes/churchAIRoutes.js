
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const churchAIController = require("../controllers/churchAIController");

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(1, 2, 3, 4, 5));

router.post("/context", churchAIController.getContext);

module.exports = router;
