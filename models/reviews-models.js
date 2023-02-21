const db = require("../db/connection");

//comment_count which is the total count of all the comments with this review_id - you should make use of queries to the database in order to achieve this.

selectReviews = () => {
	//query should return all from reviews and the comment count for each review
	return db
		.query(
			`SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id GROUP BY reviews.review_id ORDER BY reviews.created_at DESC;`
		)
		.then((result) => {
			return result.rows;
		});
};

module.exports = selectReviews;
