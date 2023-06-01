const router = require("express").Router();
const quotesController = require("../controllers/quotesController");
const validateAuth = require("../middlewares/validateAuthMiddleware");

// For Cache Content
const apicache = require("apicache");
const cache = apicache.middleware;

router.get("/", [validateAuth, cache("30 minutes")], quotesController.getQuote);

module.exports = router;