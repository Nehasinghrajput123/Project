const Task = require("../models/task.model");
const Project = require("../models/project.model");
const { getIO } = require("../config/socket");

/**
 * Create Task
 */
const createTask = async (payload, userId) => {
    const project = await Project.findById(payload.projectId);

    if (!project) {
        throw new Error("Project not found.");
    }

    const task = await Task.create({
        title: payload.title,
        description: payload.description,
        status: payload.status || "Todo",
        priority: payload.priority || "Medium",
        dueDate: payload.dueDate,
        projectId: payload.projectId,
        assignedTo: payload.assignedTo,
        createdBy: userId,
    });

    // Socket Event
    const io = getIO();
    io.to(task.projectId.toString()).emit("taskCreated", task);

    return task;
};

/**
 * Get All Tasks By Project
 */
const getTasksByProject = async (projectId) => {
    const project = await Project.findById(projectId);

    if (!project) {
        throw new Error("Project not found.");
    }

    const tasks = await Task.find({ projectId })
        .populate("assignedTo", "name email")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });

    return tasks;
};

/**
 * Get Task By Id
 */
const getTaskById = async (taskId) => {
    const task = await Task.findById(taskId)
        .populate("projectId", "name")
        .populate("assignedTo", "name email")
        .populate("createdBy", "name email");

    if (!task) {
        throw new Error("Task not found.");
    }

    return task;
};

/**
 * Update Task
 */
const updateTask = async (taskId, payload) => {
    const task = await Task.findById(taskId);

    if (!task) {
        throw new Error("Task not found.");
    }

    task.title = payload.title ?? task.title;
    task.description = payload.description ?? task.description;
    task.status = payload.status ?? task.status;
    task.priority = payload.priority ?? task.priority;
    task.dueDate = payload.dueDate ?? task.dueDate;
    task.assignedTo = payload.assignedTo ?? task.assignedTo;

    await task.save();

    // Socket Event
    const io = getIO();
    io.to(task.projectId.toString()).emit("taskUpdated", task);

    return task;
};

/**
 * Delete Task
 */
const deleteTask = async (taskId) => {
    const task = await Task.findById(taskId);

    if (!task) {
        throw new Error("Task not found.");
    }

    const projectId = task.projectId;

    await Task.findByIdAndDelete(taskId);

    // Socket Event
    const io = getIO();
    io.to(projectId.toString()).emit("taskDeleted", {
        taskId,
    });

    return true;
};

module.exports = {
    createTask,
    getTasksByProject,
    getTaskById,
    updateTask,
    deleteTask,
};