const AuthService = require("../services/auth.services");
const User = require("../models/user.model")

const {
    registerSchema,
    loginValidation,
    loginSchema,
} = require("../validation/validation");

const {
    successResponse,
    badRequestResponse,
    serverErrorResponse,
} = require("../utils/apiResponse");

/**
 * Register User
 */
const register = async (req, res) => {
    try {
        const { error } = registerSchema.validate(req.body);

        if (error) {
            return badRequestResponse(
                res,
                error.details[0].message
            );
        }

        const user = await AuthService.register(req.body);

        return successResponse(
            res,
            "User registered successfully.",
            user,
            201
        );
    } catch (error) {
        return serverErrorResponse(
            res,
            error.message
        );
    }
};

/**
 * Login User
 */
const login = async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);
        console.log("khdqhdiwhdiw",error)

        if (error) {
            return badRequestResponse(
                res,
                error.details[0].message
            );
        }

        const result = await AuthService.login(req.body);
        return successResponse(
            res,
            "Login successful.",
            result
        );
    } catch (error) {
        console.log("wkhdwhduw",error)
        return serverErrorResponse(
            res,
            error.message
        );
    }
};

/**
 * Logged In User Profile
 */
const profile = async (req, res) => {
    try {
        const user = await AuthService.getProfile(req.user._id);

        return successResponse(
            res,
            "Profile fetched successfully.",
            user
        );
    } catch (error) {
        return serverErrorResponse(
            res,
            error.message
        );
    }
};
const getAllUser = async (req, res) => {
    try {

        const extractAllUser = await User.find({
            role: "Member"
        });


        return successResponse(
            res,
            "Users fetched successfully.",
            extractAllUser
        );


    } catch (err) {
console.log("wkhdwhdiw",err)
        return serverErrorResponse(
            res,
            err.message
        );

    }
};

module.exports = {
    register,
    login,
    profile,
    getAllUser
};