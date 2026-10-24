
const express = require("express");

const router = express.Router();

const ministryController = require("../controllers/ministryController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.use(authMiddleware);

// Ministry Leader: retrieve only ministries they actively lead.
router.get(
  "/my-ministries",
  roleMiddleware(4),
  ministryController.getMyMinistries
);

// Ministry Leader: scoped member and ministry management.
router.get(
  "/:id/leader-members",
  roleMiddleware(4),
  ministryController.getLeaderMembers
);

router.patch(
  "/:id/leader-details",
  roleMiddleware(4),
  ministryController.updateLeaderMinistry
);

router.post(
  "/:id/leader-members",
  roleMiddleware(4),
  ministryController.assignLeaderMember
);

router.patch(
  "/:id/leader-members/:memberId/status",
  roleMiddleware(4),
  ministryController.updateLeaderAssignmentStatus
);

router.delete(
  "/:id/leader-members/:memberId",
  roleMiddleware(4),
  ministryController.removeLeaderAssignment
);

// Existing administrative routes remain restricted to Admin,
// Pastor, and Church Elder.
router.use(roleMiddleware(1, 2, 3));

router.get("/", ministryController.list);
router.post("/", ministryController.create);
router.get("/:id", ministryController.getById);
router.put("/:id", ministryController.update);
router.patch("/:id/status", ministryController.updateStatus);

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
