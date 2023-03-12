const {
	selectReviews,
	selectReviewById,
	selectCommentsByReviewId,
	addCommentById,
	updateReviewById,
} = require("../models/reviews-models");

getReviews = (request, response, next) => {
	selectReviews()
		.then((result) => {
			response.status(200).send({ reviews: result });
		})
		.catch(next);
};

getReviewById = (request, response, next) => {
	const { review_id } = request.params;
	selectReviewById(review_id)
		.then((review) => {
			response.status(200).send({ review: review });
		})
		.catch((error) => {
			next(error);
		});
};

getCommentsByReviewId = (request, response, next) => {
	const { review_id } = request.params;
	selectCommentsByReviewId(review_id)
		.then((comments) => {
			response.status(200).send({ comments: comments });
		})
		.catch((error) => {
			next(error);
		});
};

postCommentById = (request, response, next) => {
	const newComment = request.body;
	const { review_id } = request.params;
	addCommentById(newComment, review_id)
		.then((postedComment) => {
			response.status(201).send({ comment: postedComment });
		})
		.catch((err) => {
			next(err);
		});
};

patchReviewById = (request, response, next) => {
	const { review_id } = request.params;
	const { inc_votes } = request.body;

	updateReviewById(review_id, inc_votes)
		.then((updatedReview) => {
			response.status(200).send(updatedReview);
		})
		.catch((err) => {
			next(err);
		});
};

module.exports = {
	getReviews,
	getReviewById,
	getCommentsByReviewId,
	postCommentById,
	patchReviewById,
};
