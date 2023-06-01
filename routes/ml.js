const router = require("express").Router();
const mlController = require("../controllers/mlController");
const validateAuth = require("../middlewares/validateAuthMiddleware");
const Multer = require('multer');
const uploadImage = require("../middlewares/uploadImageMiddleware");
const mlValidation = require("../middlewares/mlValidationMiddleware")

// Configure multer to handle file uploads
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
    }
});

// Predict Allergy Detection
router.post("/allergy-detection", [validateAuth, multer.single("allergy_image"), uploadImage.multerErrorHandler(), uploadImage.uploadToGCS("histories"), mlValidation.allergyDetection()], mlController.allergyDetection);

module.exports = router;