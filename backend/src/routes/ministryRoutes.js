
const express = require("express");

const router = express.Router();

const ministryController = require("../controllers/ministryController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.use(authMiddleware);
router.use(roleMiddleware(1, 2, 3));

// Ministry CRUD and status
router.get("/", ministryController.list);
router.post("/", ministryController.create);
router.get("/:id", ministryController.getById);
router.put("/:id", ministryController.update);
router.patch("/:id/status", ministryController.updateStatus);

// Assignments and leadership
router.get("/:id/members", ministryController.getMembers);
router.post("/:id/members", ministryController.assignMember);
router.delete(
  "/:id/members/:memberId",
  ministryController.removeAssignment
);
router.post(
  "/:id/members/:memberId/move",
  ministryController.moveMember
);

module.exports = router;
