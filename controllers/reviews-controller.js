const {
	selectReviews,
	selectReviewById,
	selectCommentsByReviewId,
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

module.exports = { getReviews, getReviewById, getCommentsByReviewId };
