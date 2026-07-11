const ProjectService = require("../services/project.service");
const Project = require("../models/project.model")

const {
    createProjectValidation,
    updateProjectValidation,
} = require("../validation/validation");

const {
    successResponse,
    badRequestResponse,
    notFoundResponse,
    serverErrorResponse,
} = require("../utils/apiResponse");

/**
 * Create Project
 */
const createProject = async (req, res) => {
    try {
        const { error } = createProjectValidation.validate(req.body);

        if (error) {
            return badRequestResponse(res, error.details[0].message);
        }

       
  const existingProject = await Project.findOne({
            name: req.body.name
        });


        if (existingProject) {
            return badRequestResponse(
                res,
                "Project name already exists. Please use another name."
            );
        }
        const project = await ProjectService.createProject(
            req.body,
            req.user._id
        );

        return successResponse(
            res,
            "Project created successfully.",
            project,
            201
        );
    } catch (error) {
        console.log("wfuhfue",error)
        return serverErrorResponse(res, error.message);
    }
};

/**
 * Get All Projects
 */

const getAllProjects = async (req, res) => {
    try {
        let page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 6;


        const totalProjects = await ProjectService.countDocument();
        const totalPages = Math.ceil(totalProjects / limit) || 1;

        const projects = await ProjectService.getAllProjects({
            page,
            limit,
        });

        return successResponse(
            res,
            "Projects fetched successfully.",
            {
                projects,
                pagination: {
                    totalItems: totalProjects,
                    totalPages,
                    currentPage: page,
                    itemsPerPage: limit,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1,
                },
            }
        );
    } catch (error) {
        console.error("Error in getAllProjects controller:", error);
        return serverErrorResponse(res, error.message);
    }
};

/**
 * Get Project By Id
 */
const getProjectById = async (req, res) => {
    try {
        const projectId = req.params.id ? req.params.id.trim() : null;

        if (!projectId) {
            return notFoundResponse(res, "Invalid project ID.");
        }
        const project = await ProjectService.getProjectById(projectId);

        if (!project) {
            return notFoundResponse(res, "Project not found.");
        }

        return successResponse(
            res,
            "Project fetched successfully.",
            project
        );
    } catch (error) {
        return serverErrorResponse(res, error.message);
    }
};

/**
 * Update Project
 */
const updateProject = async (req, res) => {
    try {
        const { error } = updateProjectValidation.validate(req.body);

        if (error) {
            return badRequestResponse(res, error.details[0].message);
        }

        const project = await ProjectService.updateProject(
            req.params.id,
            req.body
        );

        if (!project) {
            return notFoundResponse(res, "Project not found.");
        }

        return successResponse(
            res,
            "Project updated successfully.",
            project
        );
    } catch (error) {
        return serverErrorResponse(res, error.message);
    }
};

/**
 * Delete Project
 */
const deleteProject = async (req, res) => {
    try {
        const project = await ProjectService.deleteProject(req.params.id);

        if (!project) {
            return notFoundResponse(res, "Project not found.");
        }

        return successResponse(
            res,
            "Project deleted successfully."
        );
    } catch (error) {
        return serverErrorResponse(res, error.message);
    }
};
const getProjectsByUserId = async (req, res) => {
    try {
        console.log("ehcuehuehuhufhufh")
        const userId = req.user.id;
        console.log("bufegfuegfuge",userId)
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;
        const query = { members: userId };

        const totalItems = await Project.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);

        // Fetch numbers cleanly
        const projects = await Project.find(query)
            .populate("createdBy", "name email") // Kis admin ne banaya uski details
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Naye projects sabse upar

        return res.status(200).json({
            success: true,
            message: "User's assigned projects fetched successfully.",
            data: {
                projects,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems
                }
            }
        });

    } catch (error) {
        console.error("Error fetching user projects:", error);
        // return res.status(500).json({
        //     success: false,
        //     message: "Internal server error while fetching assigned workflows.",
        //     error: error.message
        // });
    }
};
module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    getProjectsByUserId
};