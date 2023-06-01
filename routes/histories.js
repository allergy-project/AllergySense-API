const router = require("express").Router();
const historiesController = require("../controllers/historiesController");
const validateAuth = require("../middlewares/validateAuthMiddleware");
const historyValidation = require("../middlewares/historyValidationMiddleware");
const Multer = require('multer');
const uploadImage = require("../middlewares/uploadImageMiddleware");

// Configure multer to handle file uploads
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
    }
});

// Get All Histories
router.get("/", validateAuth, historiesController.getHistories);

// Get Hisotry By Id
router.get("/:id", validateAuth, historiesController.getHistoryById);

// Create History
// Functionality of This Features Moved to allergy-check Endpoint Features
/*
router.post("/", [validateAuth, multer.single("history_image"), uploadImage.multerErrorHandler(), uploadImage.uploadToGCS("histories"), historyValidation.create()], historiesController.createHistory);
*/

// Delete History
router.delete("/:id", validateAuth, historiesController.deleteHistory);

module.exports = router;