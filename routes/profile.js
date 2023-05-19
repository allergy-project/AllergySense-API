const router = require("express").Router();
const validateAuth = require("../middlewares/validateAuthMiddleware")
const profileController = require("../controllers/profileController")
const {updateProfile} = require("../middlewares/userValidationMiddleware")

// Get Profile
router.get("/", validateAuth, profileController.getProfile);

// Edit Profile
router.put("/", [validateAuth, updateProfile()], profileController.updateProfile);

module.exports = router;