const successResponse = (res, message, data = null, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

const badRequestResponse = (res, message = "Bad Request", errors = null) => {
    return res.status(400).json({
        success: false,
        message,
        errors
    });
};

const unauthorizedResponse = (res, message = "Unauthorized") => {
    return res.status(401).json({
        success: false,
        message
    });
};

const forbiddenResponse = (res, message = "Forbidden") => {
    return res.status(403).json({
        success: false,
        message
    });
};

const notFoundResponse = (res, message = "Resource not found") => {
    return res.status(404).json({
        success: false,
        message
    });
};

const serverErrorResponse = (
    res,
    message = "Internal Server Error",
    error = null
) => {
    return res.status(500).json({
        success: false,
        message,
        error
    });
};

module.exports = {
    successResponse,
    badRequestResponse,
    unauthorizedResponse,
    forbiddenResponse,
    notFoundResponse,
    serverErrorResponse
};