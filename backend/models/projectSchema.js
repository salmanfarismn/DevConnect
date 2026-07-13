const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: [3, "Title should be atleast 3 characters long."]
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    budget: {
        type: Number,
        min: [1, "Budget must be greater than 0"],
        required: true
    },
    timeline: {
        type: String,
        required: true
    },
    clientId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    developerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    status: {
        type: String,
        enum: ["open", "in-progress", "completed"],
        default: "open"
    }
}, {timestamps: true});

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;