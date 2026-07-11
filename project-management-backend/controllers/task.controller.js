const TaskService = require("../services/task.services");
const Tasks = require("../models/task.model")

const {
    createTaskValidation,
    updateTaskValidation,
} = require("../validation/validation");

const {
    successResponse,
    badRequestResponse,
    notFoundResponse,
    serverErrorResponse,
} = require("../utils/apiResponse");

/**
 * Create Task
 */
const createTask = async (req, res) => {
    try {
        const { error } = createTaskValidation.validate(req.body);

        if (error) {
            return badRequestResponse(res, error.details[0].message);
        }

        const task = await TaskService.createTask(req.body, req.user._id);

        return successResponse(
            res,
            "Task created successfully.",
            task,
            201
        );
    } catch (error) {
        return serverErrorResponse(res, error.message);
    }
};

/**
 * Get Tasks By Project
 */
const getTasksByProject = async (req, res) => {
    try {
        const tasks = await TaskService.getTasksByProject(req.params.projectId);

        return successResponse(
            res,
            "Tasks fetched successfully.",
            tasks
        );
    } catch (error) {
        return serverErrorResponse(res, error.message);
    }
};

/**
 * Get Task By Id
 */
const getTaskById = async (req, res) => {
    try {
        const task = await TaskService.getTaskById(req.params.id);

        if (!task) {
            return notFoundResponse(res, "Task not found.");
        }

        return successResponse(
            res,
            "Task fetched successfully.",
            task
        );
    } catch (error) {
        return serverErrorResponse(res, error.message);
    }
};

/**
 * Update Task
 */
const updateTask = async (req, res) => {
    try {
        const { error } = updateTaskValidation.validate(req.body);

        if (error) {
            return badRequestResponse(res, error.details[0].message);
        }

        const task = await TaskService.updateTask(
            req.params.id,
            req.body
        );

        if (!task) {
            return notFoundResponse(res, "Task not found.");
        }

        return successResponse(
            res,
            "Task updated successfully.",
            task
        );
    } catch (error) {
        return serverErrorResponse(res, error.message);
    }
};

/**
 * Delete Task
 */
const deleteTask = async (req, res) => {
    try {
        await TaskService.deleteTask(req.params.id);

        return successResponse(
            res,
            "Task deleted successfully."
        );
    } catch (error) {
        return serverErrorResponse(res, error.message);
    }
};
const getTaskUserId = async (req, res) => {
    try {
        const userId = req.user.id
      const tasks = await Tasks.find({ assignedTo: userId })
            .populate("assignedTo", "name email") 
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 }); 

        return successResponse(
            res,
            "Tasks fetched successfully.",
            tasks
        );
       
    } catch (error) {
        console.log("dnehduedhuedhuehuedh",error)
        return serverErrorResponse(res, error.message);
    }
};
const updateStatus = async (req, res) => {
    try {
        const { taskId } = req.params; 
                const { status } = req.body; 
        const updatedTask = await Tasks.findByIdAndUpdate(
            taskId,
            { status: status },
            { new: true, runValidators: true }
        )
        .populate("assignedTo", "name email")
        .populate("createdBy", "name email");
        if (!updatedTask) {
            return notFoundResponse(res, "Task not found.");
        }
        if (req.app.get("io")) {
            const io = req.app.get("io");
            io.to(updatedTask.projectId.toString()).emit("taskStatusUpdated", updatedTask);
        }
        return successResponse(
            res,
            "Task status updated successfully.",
            updatedTask
        );
       
    } catch (error) {
        console.log("Error inside updateStatus:", error);
        return serverErrorResponse(res, error.message);
    }
};

module.exports = {
    createTask,
    getTasksByProject,
    getTaskById,
    updateTask,
    deleteTask,
    getTaskUserId,
    updateStatus
};