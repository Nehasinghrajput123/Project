const express = require("express");

const router = express.Router();

const taskController = require("../controllers/task.controller");
const authenticate = require("../middleware/auth.middleware");

/**
 * Create Task
 */
router.post(
    "/",
    authenticate,
    taskController.createTask
);

/**
 * Get Tasks By Project
 */
router.get(
    "/project/:projectId",
    authenticate,
    taskController.getTasksByProject
);

/**
 * Get Task By Id
 */
router.get(
    "/:id",
    authenticate,
    taskController.getTaskById
);

/**
 * Update Task
 */
router.put(
    "/:id",
    authenticate,
    taskController.updateTask
);

/**
 * Delete Task
 */
router.delete(
    "/:id",
    authenticate,
    taskController.deleteTask
);
router.get("/getTask/userId",authenticate,taskController.getTaskUserId)
router.patch("/:taskId",authenticate,taskController.updateStatus)
module.exports = router;