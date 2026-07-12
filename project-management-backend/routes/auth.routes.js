const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controllers");
const authenticate = require("../middleware/auth.middleware");

router.post("/register", authController.register);

router.post("/login", authController.login);
router.get("/users",authController.getAllUser)
router.get("/dashboard",authController.dashboardApiAdmin)
router.get("/getUserAssignedStats",authenticate,authController.getUserAssignedStats)

router.get(
    "/profile",
    authenticate,
    authController.profile
);

module.exports = router;