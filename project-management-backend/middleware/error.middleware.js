const { serverErrorResponse } = require("../utils/apiResponse");

const errorHandler = (err, req, res, next) => {
    console.error(err);

    return serverErrorResponse(
        res,
        err.message || "Internal Server Error"
    );
};

module.exports = errorHandler;