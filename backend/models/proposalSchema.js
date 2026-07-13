const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const proposalSchema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    developerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    proposalText: {
        type: String,
        trim: true,
        required: true
    },
    estimatedCost: {
        type: Number,
        required: true,
        min: [1, "Estimated cost must be greater than 0"]
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    }
}, {timestamps: true});

const Proposal = mongoose.model("Proposal", proposalSchema);
module.exports = Proposal;
