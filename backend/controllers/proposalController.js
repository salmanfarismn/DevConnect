const Project = require("../models/projectSchema");
const Proposal = require("../models/proposalSchema");
const wrapAsync = require("../utils/wrapAsync");



exports.createProposal = wrapAsync(async(req, res) => {
    const { proposalText, estimatedCost } = req.body;
    const proposal = new Proposal({
        projectId: req.params.projectId,
        developerId: req.user.id,
        proposalText,
        estimatedCost
    });

    await proposal.save()
    res.status(201).json({ message: "Proposal submitted", proposal });
});

exports.updateProposal = wrapAsync(async(req, res) => {
    const proposal = await Proposal.findById(req.params.proposalId);
    if(!proposal) {
        throw new ExpressError("Proposal not found.", 404);
    }

    if(req.user.role === "developer" && req.user.id !== proposal.developerId.toString()) {
        throw new ExpressError("You're not authorized to update this proposal", 403);
    }

    const updateProposal = await Proposal.findByIdAndUpdate(req.params.proposalId, { ...req.body }, { returnDocument: "after" });
    res.status(200).json({ message: "Proposal Updated", proposal: updateProposal });
});

exports.deleteProposal = wrapAsync(async(req, res) => {
    const proposal = await Proposal.findById(req.params.proposalId);
    if(!proposal) {
        throw new ExpressError("Proposal not found!", 404);
    }

    if(req.user.role === "developer" && req.user.id !== proposal.developerId.toString()) {
        throw new ExpressError("You're not authorized to delete this proposal", 403);
    }

    await Proposal.findByIdAndDelete(req.params.proposalId);
    res.status(200).json({ message: "Proposal deleted successfully" });
});

exports.getProposalsByProject = wrapAsync(async(req, res) => {
    const proposals = await Proposal.find({ projectId: req.params.projectId });
    if(!proposals || proposals.length === 0) {
        throw new ExpressError("No proposal found for this project.", 404);
    }

    res.status(200).json({ proposals });
});

exports.getProposalById = wrapAsync(async (req, res) => {
    const proposal = await Proposal.findById(req.params.proposalId);
    if (!proposal) {
        throw new ExpressError("Proposal not found!", 404);
    }
    res.status(200).json({ proposal });
});


exports.acceptProposal = wrapAsync(async(req, res) => {
    try {
        const proposal = await Proposal.findById(req.params.proposalId).populate("projectId");
        if(!proposal) {
            throw new ExpressError("Proposal not found!", 404);
        }

        if(req.user.role === "client" && req.user.id !== proposal.projectId.clientId.toString()) {
            throw new ExpressError("You're not authorized to accept this proposal", 403);
        }

        // Update proposal status
        proposal.status = "accepted";
        await proposal.save();

        // Update project with developerId from the proposal
        proposal.projectId.developerId = proposal.developerId;
        proposal.projectId.status = "in-progress";
        await proposal.projectId.save();

        res.status(200).json({ message: "Proposal accepted sucessfully", proposal });
    } catch (err){
        console.error(err)
        res.status(500).json({ message: "Failed to accept proposal" });
    }
})

exports.rejectProposal = wrapAsync(async(req, res) => {
    try {
        const proposal = await Proposal.findById(req.params.proposalId).populate("projectId");
        if(!proposal) {
            throw new ExpressError("Proposal not found!", 404);
        }

        if(req.user.role === "client" && req.user.id !== proposal.projectId.clientId.toString()) {
            throw new ExpressError("You're not authorized to reject this proposal", 403);
        }

        proposal.status = "rejected";
        await proposal.save();
        res.status(200).json({ message: "Proposal rejected successfully" });
    } catch {
        res.status(500).json({ message: "Failed to reject proposal" });
    }
});

exports.getAllProposals = wrapAsync(async(req, res) => {
    const proposals = await Proposal.find({});
    if(proposals.length === 0) {
        throw new ExpressError("Proposals not found!", 404);
    }
    res.status(200).json({ message: "Fetched all proposals", proposals });
});