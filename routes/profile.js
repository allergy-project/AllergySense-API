const router = require("express").Router();
const validateAuth = require("../middlewares/validateAuthMiddleware")
const profileController = require("../controllers/profileController")
const {updateProfile} = require("../middlewares/userValidationMiddleware")
const Multer = require('multer');
const uploadImage = require("../middlewares/uploadImageMiddleware");

// Configure multer to handle file uploads
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
    }
});

// Get Profile
router.get("/", validateAuth, profileController.getProfile);

// Edit Profile
router.put("/", [validateAuth, multer.single("profile_image"), uploadImage.multerErrorHandler(), uploadImage.uploadToGCS(), updateProfile()], profileController.updateProfile);

module.exports = router;