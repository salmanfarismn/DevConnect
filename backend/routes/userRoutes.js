const express = require("express");
const router = express.Router({ mergeParams: true });
const userController = require("../controllers/userController");
const {authenticateToken, authorizeRoles } = require("../middleware/auth");

router.get("/", authenticateToken, authorizeRoles("admin"), userController.getAllUsers);
router.get("/:userId", authenticateToken, authorizeRoles("admin"), userController.getUserById);
router.delete("/:userId", authenticateToken, authorizeRoles("client", "admin"), userController.deleteUser);

module.exports = router;