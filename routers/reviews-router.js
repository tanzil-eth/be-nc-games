const express = require("express");
const {
	getReviews,
	getReviewById,
	getCommentsByReviewId,
} = require("../controllers/reviews-controller");
const reviewsRouter = express.Router();

reviewsRouter.route("/").get(getReviews);
reviewsRouter.route("/:review_id").get(getReviewById);
reviewsRouter.route("/:review_id/comments").get(getCommentsByReviewId);

module.exports = reviewsRouter;
