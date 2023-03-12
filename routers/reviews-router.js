const express = require("express");
const {
	getReviews,
	getReviewById,
	getCommentsByReviewId,
	postCommentById,
	patchReviewById,
} = require("../controllers/reviews-controller");
const reviewsRouter = express.Router();

reviewsRouter.route("/").get(getReviews);
reviewsRouter.route("/:review_id").get(getReviewById).patch(patchReviewById);
reviewsRouter
	.route("/:review_id/comments")
	.get(getCommentsByReviewId)
	.post(postCommentById);

module.exports = reviewsRouter;
