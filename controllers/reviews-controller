const selectReviews = require("../models/reviews-models");

getReviews = (req, res, next) => {
	selectReviews()
		.then((result) => {
			res.status(200).send({ reviews: result });
		})
		.catch(next);
};

module.exports = getReviews;
