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

selectReviewById = (reviewId) => {
	return db
		.query(`SELECT * FROM reviews WHERE review_id = $1;`, [reviewId])
		.then((result) => {
			const review = result.rows[0];
			if (!review) {
				return Promise.reject({
					status: 404,
				});
			}
			return review;
		});
};

selectCommentsByReviewId = (reviewId) => {
	return db
		.query(
			`SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC`,
			[reviewId]
		)
		.then((response) => {
			return response.rows;
		});
};

addCommentById = (newComment, reviewId) => {
	if (!reviewId) {
		return Promise.reject({
			status: 404,
		});
	}
	if (!newComment.body || !newComment.username) {
		return Promise.reject({
			status: 400,
		});
	}
	return db
		.query(
			`INSERT INTO comments
			(body, author, review_id )
			VALUES
			($1, $2, $3)
			RETURNING *;`,
			[newComment.body, newComment.username, reviewId]
		)
		.then(({ rows }) => {
			const postedComment = rows[0];
			return postedComment;
		});
};

updateReviewById = (reviewId, votesInc) => {
	if (!votesInc) {
		return Promise.reject({ status: 400 });
	}
	return db
		.query(
			`UPDATE reviews
		SET votes = votes + $1
		WHERE review_id = $2
		RETURNING *`,
			[votesInc, reviewId]
		)
		.then(({ rows }) => {
			if (!rows.length) {
				return Promise.reject({ status: 404 });
			} else {
				return rows[0];
			}
		});
};

module.exports = {
	selectReviews,
	selectReviewById,
	selectCommentsByReviewId,
	addCommentById,
	updateReviewById,
};
