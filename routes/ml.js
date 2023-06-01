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

// Predict Allergy Check
router.post("/allergy-check", [validateAuth, multer.single("allergy_image"), uploadImage.multerErrorHandler(), uploadImage.uploadToGCS("histories"), mlValidation.allergyCheck()], mlController.allergyCheck);

module.exports = router;