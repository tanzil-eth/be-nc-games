const db = require("../db/connection");

selectReviews = () => {
	return db.query(`SELECT * FROM reviews;`).then((result) => {
		return result.rows;
	});
};

module.exports = selectReviews;
