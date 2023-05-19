const router = require("express").Router();
const historiesController = require("../controllers/historiesController");
const validateAuth = require("../middlewares/validateAuthMiddleware");
const historyValidation = require("../middlewares/historyValidationMiddleware")
const apicache = require("apicache");
const cache = apicache.middleware;

// Get All Histories
router.get("/", [validateAuth, cache("30 minutes")], historiesController.getHistories);

// Get Hisotry By Id
router.get("/:id", validateAuth, historiesController.getHistoryById);

// Create History
router.post("/", [validateAuth, historyValidation.create()], historiesController.createHistory);

// Create History
router.delete("/:id", validateAuth, historiesController.deleteHistory);

module.exports = router;