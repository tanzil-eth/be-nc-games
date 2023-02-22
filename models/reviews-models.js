const db = require("../db/connection");

selectReviews = () => {
	return db
		.query(
			`SELECT reviews.*, CAST(COUNT(comments.review_id) AS INTEGER) AS comment_count
			FROM reviews
			LEFT JOIN comments ON reviews.review_id = comments.review_id
			GROUP BY reviews.review_id
			ORDER BY reviews.created_at DESC;`
		)
		.then((result) => {
			return result.rows;
		});
};

module.exports = selectReviews;
