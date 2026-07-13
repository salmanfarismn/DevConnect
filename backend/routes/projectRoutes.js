const express = require("express");
const router = express.Router({ mergeParams: true });
const projectController = require("../controllers/projectController");
const {authenticateToken, authorizeRoles } = require("../middleware/auth");
const { validateProjects } = require("../validation/validation");

router.get("/",authenticateToken, authorizeRoles("developer", "admin"), projectController.getAllProjects);
router.get("/:projectId", authenticateToken, authorizeRoles("developer"), projectController.getProjectById);
router.post("/", authenticateToken, authorizeRoles("client"), validateProjects, projectController.createProject);
router.put("/:projectId", authenticateToken, authorizeRoles("client"), validateProjects, projectController.updateProject);
router.delete("/:projectId", authenticateToken, authorizeRoles("client", "admin"), projectController.deleteProject);

module.exports = router;