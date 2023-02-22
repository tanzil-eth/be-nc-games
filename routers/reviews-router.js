const express = require("express");
const getReviews = require("../controllers/reviews-controller");
const reviewsRouter = express.Router();

reviewsRouter.route("/").get(getReviews);

module.exports = reviewsRouter;
