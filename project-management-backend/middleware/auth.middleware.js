const { unauthorizedResponse } = require("../utils/apiResponse");
const { verifyToken } = require("../utils/generateToken");
const User = require("../models/user.model");

const authenticate = async (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return unauthorizedResponse(
                res,
                "Access denied. Token is missing."
            );
        }

        const token = authHeader.split(" ")[1];

        const decoded = verifyToken(token);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return unauthorizedResponse(
                res,
                "User not found."
            );
        }

        req.user = user;

        next();

    } catch (error) {

        return unauthorizedResponse(
            res,
            "Invalid or expired token."
        );

    }
};

module.exports = authenticate;