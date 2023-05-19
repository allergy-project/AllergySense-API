const router = require("express").Router();
const authController = require("../controllers/authController");
const userValidation = require("../middlewares/userValidationMiddleware");

// Register
router.post("/register", userValidation.register(), authController.register);

// Login
router.post("/login", userValidation.login(), authController.login);

// Verify/Verification Account
router.get("/verify/:code", authController.verify);

module.exports = router;