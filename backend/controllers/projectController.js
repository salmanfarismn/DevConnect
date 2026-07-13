const Project = require("../models/projectSchema");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

// To get all projects
exports.getAllProjects = wrapAsync(async(req, res) => {
    const projects = await Project.find({});
    if(projects.length === 0) {
        throw new ExpressError("Project not found", 404);
    }
    res.status(200).json({ projects });
});

// To get a specific project
exports.getProjectById = wrapAsync(async(req, res) => {
    const project = await Project.findById(req.params.projectId);
    if(!project) {
        throw new ExpressError("Project not found!", 404);
    }
    
    res.status(200).json({ project });
});

// To create projects
exports.createProject = wrapAsync(async(req, res) => {
    const { title, description, budget, timeline } = req.body;
    const newProject = new Project({
        title,
        description,
        budget,
        timeline,
        clientId: req.body.clientId
    });

    await newProject.save()
    res.status(201).json({ message: "New project created" });
});

// Update a project
exports.updateProject = wrapAsync(async(req, res) => {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
        throw new ExpressError("Project not found!", 404);
    }

    if(req.user.id != project.clientId.toString()) {
        throw new ExpressError("You can only update your own projects!", 403);
    }

    const updatedProject = await Project.findByIdAndUpdate(
        req.params.projectId, 
        { ...req.body },
        { returnDocument: "after" });

    res.status(200).json({ message: "Project updated successfully", project: updatedProject })
});

// Delete the project
exports.deleteProject = wrapAsync(async(req, res) => {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
        throw new ExpressError("Project not found!", 404);
    }

    if(req.user.role === "client" && req.user.id !== project.clientId.toString()) {
        throw new ExpressError("You can only delete your own projects!", 403);
    }

    await Project.findByIdAndDelete(req.params.projectId);
    res.status(200).json({ message: "Project deleted successfully" });
});