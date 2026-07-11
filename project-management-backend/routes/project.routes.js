const express = require("express");

const router = express.Router();

const projectController = require("../controllers/project.controllers");
const authenticate = require("../middleware/auth.middleware");

/**
 * Create Project
 */
router.post(
    "/",
    authenticate,
    projectController.createProject
);

/**
 * Get All Projects
 */
router.get(
    "/getAllProject",
    authenticate,
    projectController.getAllProjects
);

/**
 * Get Project By Id
 */
router.get(
    "/:id",
    authenticate,
    projectController.getProjectById
);

/**
 * Update Project
 */
router.put(
    "/:id",
    authenticate,
    projectController.updateProject
);

/**
 * Delete Project
 */
router.delete(
    "/:id",
    authenticate,
    projectController.deleteProject
);

router.get("/user-projects/userId", authenticate, projectController.getProjectsByUserId);
module.exports = router;