const Project = require("../models/project.model");

/**
 * Create Project
 */
const createProject = async (payload, userId) => {
    const project = await Project.create({
        name: payload.name,
        description: payload.description,
        members: payload.members || [],
        createdBy: userId,
    });

    return project;
};

/**
 * Get All Projects
 */
const getAllProjects = async ({ page = 1, limit = 6 }) => {
    const skip = (page - 1) * limit;

    const projects = await Project.find()
        .populate("createdBy", "name email")
        .populate("members", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return projects;
};

const countDocument = async () => {
    return await Project.countDocuments();
};

/**
 * Get Project By Id
 */
const getProjectById = async (projectId) => {
    const project = await Project.findById(projectId)
        .populate("createdBy", "name email")
        .populate("members", "name email");

    if (!project) {
        throw new Error("Project not found.");
    }

    return project;
};

/**
 * Update Project
 */
const updateProject = async (projectId, payload) => {
    const project = await Project.findById(projectId);

    if (!project) {
        throw new Error("Project not found.");
    }

    project.name = payload.name ?? project.name;
    project.description = payload.description ?? project.description;
    project.status = payload.status ?? project.status;
    project.members = payload.members ?? project.members;

    await project.save();

    return project;
};

/**
 * Delete Project
 */
const deleteProject = async (projectId) => {
    const project = await Project.findById(projectId);

    if (!project) {
        throw new Error("Project not found.");
    }

    await Project.findByIdAndDelete(projectId);

    return true;
};

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    countDocument
};