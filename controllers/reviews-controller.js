const { selectReviews, selectReviewById } = require("../models/reviews-models");

getReviews = (req, res, next) => {
	selectReviews()
		.then((result) => {
			res.status(200).send({ reviews: result });
		})
		.catch(next);
};

getReviewById = (request, response, next) => {
	const { review_id } = request.params;
	selectReviewById(review_id)
		.then((review) => {
			response.status(200).send({review: review});
		})
		.catch((error) => {
			next(error);
		});
};

module.exports = { getReviews, getReviewById };
