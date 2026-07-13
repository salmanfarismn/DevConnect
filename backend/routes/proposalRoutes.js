const express = require("express");
const router = express.Router({ mergeParams: true });
const proposalController = require("../controllers/proposalController");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const { validateProposals } = require("../validation/validation");

router.post("/:projectId", authenticateToken, authorizeRoles("developer"), validateProposals, proposalController.createProposal);
router.put("/:proposalId", authenticateToken, authorizeRoles("developer", "admin"), validateProposals, proposalController.updateProposal);
router.delete("/:proposalId", authenticateToken, authorizeRoles("developer", "admin"), proposalController.deleteProposal);
router.get("/", authenticateToken, authorizeRoles("admin"), proposalController.getAllProposals);
router.patch("/:proposalId/accept", authenticateToken, authorizeRoles("client"), proposalController.acceptProposal);
router.patch("/:proposalId/reject", authenticateToken, authorizeRoles("client"), proposalController.rejectProposal);
router.get("/:proposalId", authenticateToken, authorizeRoles("client", "admin"), proposalController.getProposalById);
router.get("/project/:projectId", authenticateToken, authorizeRoles("client"), proposalController.getProposalsByProject);


module.exports = router;
