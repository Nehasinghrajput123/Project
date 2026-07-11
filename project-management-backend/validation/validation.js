const Joi = require("joi");

const registerSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .required()
        .messages({
            "string.empty": "Name is required.",
            "string.min": "Name must be at least 3 characters.",
            "any.required": "Name is required."
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.email": "Please enter a valid email.",
            "any.required": "Email is required."
        }),

    password: Joi.string()
        .min(6)
        .required()
        .messages({
            "string.min": "Password must be at least 6 characters.",
            "any.required": "Password is required."
        }),

    role: Joi.string()
        .valid("Admin", "Member")
        .optional()
});

const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            "any.required": "Email is required."
        }),

    password: Joi.string()
        .required()
        .messages({
            "any.required": "Password is required."
        })
});
const createProjectValidation = Joi.object({
    name: Joi.string().trim().required(),

    description: Joi.string().allow("").optional(),

    members: Joi.array().items(Joi.string()).optional(),
});

const updateProjectValidation = Joi.object({
    name: Joi.string().trim().optional(),

    description: Joi.string().allow("").optional(),

    status: Joi.string()
        .valid("Active", "Completed")
        .optional(),

    members: Joi.array().items(Joi.string()).optional(),
});

const createTaskValidation = Joi.object({
    title: Joi.string().trim().required(),

    description: Joi.string().allow("").optional(),

    status: Joi.string()
        .valid("Todo", "In Progress", "Done")
        .optional(),

    priority: Joi.string()
        .valid("Low", "Medium", "High")
        .optional(),

    dueDate: Joi.date().optional(),

    projectId: Joi.string().required(),

    assignedTo: Joi.string().optional(),
});

const updateTaskValidation = Joi.object({
    title: Joi.string().trim().optional(),

    description: Joi.string().allow("").optional(),

    status: Joi.string()
        .valid("Todo", "In Progress", "Done")
        .optional(),

    priority: Joi.string()
        .valid("Low", "Medium", "High")
        .optional(),

    dueDate: Joi.date().optional(),

    assignedTo: Joi.string().optional(),
});



module.exports = {
    registerSchema,
    loginSchema,
     createProjectValidation,
    updateProjectValidation,
    createTaskValidation,
    updateTaskValidation,
};