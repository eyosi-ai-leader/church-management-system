const express = require("express");
const router = express.Router();

const memberController = require("../controllers/memberController");
const ministryMemberController = require("../controllers/ministryMemberController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  memberIdValidator,
  createMemberValidator,
  updateMemberValidator,
} = require("../validators/memberValidator");

const { uploadProfileImage } = require("../middleware/uploadMiddleware");
const { validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
};

router.use(authMiddleware);

/**
 * Ministry Leader routes.
 * Role 4 can access only members assigned to active ministries
 * that the authenticated leader actively leads.
 */
router.get(
  "/my-ministry",
  roleMiddleware(4),
  ministryMemberController.getMyMinistryMembers
);

router.get(
  "/my-ministry/:id",
  roleMiddleware(4),
  memberIdValidator,
  validateRequest,
  ministryMemberController.getMyMinistryMemberById
);

router.put(
  "/my-ministry/:id",
  roleMiddleware(4),
  uploadProfileImage.single("profileImage"),
  memberIdValidator,
  updateMemberValidator,
  validateRequest,
  ministryMemberController.updateMyMinistryMember
);

/**
 * Create member.
 * Roles: Admin (1), Pastor (2).
 */
router.post(
  "/",
  roleMiddleware(1, 2),
  uploadProfileImage.single("profileImage"),
  createMemberValidator,
  validateRequest,
  memberController.createMember
);

/**
 * General member list.
 * Roles: Admin (1), Pastor (2), Church Elder (3).
 */
router.get(
  "/",
  roleMiddleware(1, 2, 3),
  memberController.getAllMembers
);

/**
 * General member details.
 * Roles: Admin (1), Pastor (2), Church Elder (3).
 */
router.get(
  "/:id",
  roleMiddleware(1, 2, 3),
  memberIdValidator,
  validateRequest,
  memberController.getMemberById
);

/**
 * General member update.
 * Roles: Admin (1), Pastor (2).
 */
router.put(
  "/:id",
  roleMiddleware(1, 2),
  uploadProfileImage.single("profileImage"),
  updateMemberValidator,
  validateRequest,
  memberController.updateMember
);

/**
 * Delete member.
 * Roles: Admin (1), Pastor (2).
 */
router.delete(
  "/:id",
  roleMiddleware(1, 2),
  memberIdValidator,
  validateRequest,
  memberController.deleteMember
);

module.exports = router;
