const express = require("express");

const router = express.Router();

const memberController = require("../controllers/memberController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  memberIdValidator,
  createMemberValidator,
  updateMemberValidator,
} = require("../validators/memberValidator");

const { validationResult } = require("express-validator");

/**
 * Handle validation errors
 */
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

/**
 * Create member
 *
 * Allowed roles:
 * 1 = Admin
 * 2 = Pastor
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware(1, 2),
  createMemberValidator,
  validateRequest,
  memberController.createMember
);

/**
 * Get all members
 *
 * Allowed roles:
 * 1 = Admin
 * 2 = Pastor
 * 3 = Church Elder
 *
 * Supports:
 * - Pagination
 * - Search
 * - Status filter
 * - Role filter
 * - Sorting
 */
router.get(
  "/",
  authMiddleware,
  roleMiddleware(1, 2, 3),
  memberController.getAllMembers
);

/**
 * Get member by ID
 *
 * Allowed roles:
 * 1 = Admin
 * 2 = Pastor
 * 3 = Church Elder
 */
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(1, 2, 3),
  memberIdValidator,
  validateRequest,
  memberController.getMemberById
);

/**
 * Update member
 *
 * Allowed roles:
 * 1 = Admin
 * 2 = Pastor
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(1, 2),
  updateMemberValidator,
  validateRequest,
  memberController.updateMember
);

/**
 * Delete member
 *
 * Allowed roles:
 * 1 = Admin
 * 2 = Pastor
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(1, 2),
  memberIdValidator,
  validateRequest,
  memberController.deleteMember
);

module.exports = router;