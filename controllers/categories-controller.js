const selectCategories = require("../models/categories-models");

getCategories = (req, res, next) => {
	selectCategories()
		.then((result) => {
			res.status(200).send({ categories: result });
		})
		.catch((err) => {
			next(err);
		});
};

module.exports = getCategories;
