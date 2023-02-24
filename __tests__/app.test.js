require("jest-sorted");
const request = require("supertest");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const app = require("../db/app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("Get Categories", () => {
	test("Return all categories and a status code 200", () => {
		return request(app)
			.get("/api/categories")
			.expect(200)
			.then((result) => {
				const expected = {
					slug: "euro game",
					description: "Abstact games that involve little luck",
				};
				expect(result.body.categories[0]).toEqual(expected);
				expect(result.body.categories.length).toBe(4);
			});
	});
});

describe("Get Reviews", () => {
	test("Return reviews and a status code 200", () => {
		return request(app)
			.get("/api/reviews")
			.expect(200)
			.then((result) => {
				result.body.reviews.forEach((review) => {
					expect(review).toEqual(
						expect.objectContaining({
							title: expect.any(String),
							designer: expect.any(String),
							owner: expect.any(String),
							review_id: expect.any(Number),
							review_img_url: expect.any(String),
							review_body: expect.any(String),
							category: expect.any(String),
							created_at: expect.any(String),
							votes: expect.any(Number),
							comment_count: expect.any(Number),
						})
					);
				});
			});
	});
	test("Return reviews in descending order by default", () => {
		return request(app)
			.get("/api/reviews")
			.expect(200)
			.then((result) => {
				const reviews = result.body.reviews;
				expect(reviews).toBeSortedBy("created_at", {
					descending: true,
				});
			});
	});
});

describe("Get Review By ID", () => {
	test("Return selected review and a status code 200", () => {
		return request(app)
			.get("/api/reviews/5")
			.expect(200)
			.then((result) => {
				const review = result.body.review;
				expect(review).toEqual(
					expect.objectContaining({
						title: expect.any(String),
						designer: expect.any(String),
						owner: expect.any(String),
						review_id: 5,
						review_img_url: expect.any(String),
						review_body: expect.any(String),
						category: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
					})
				);
			});
	});
	test("Responds with 404 error when applicable", () => {
		return request(app)
			.get("/api/reviews/999")
			.expect(404)
			.then((response) => {
				const errorMessage = response.body.msg;
				expect(errorMessage).toBe("Resource not found");
			});
	});

	test("Responds with 400 error when applicable", () => {
		return request(app)
			.get("/api/reviews/banana")
			.expect(400)
			.then((response) => {
				const errorMessage = response.body.msg;
				expect(errorMessage).toBe("Bad request");
			});
	});
});

describe("Get Comments By Review ID", () => {
	test("Return an array of comments and a status code 200", () => {
		return request(app)
			.get("/api/reviews/1/comments")
			.expect(200)
			.then((result) => {
				const comments = result.body.comments;
				comments.forEach((comment) => {
					expect(comment).toMatchObject({
						comment_id: expect.any(Number),
						created_at: expect.any(String),
						votes: expect.any(Number),
						author: expect.any(String),
						body: expect.any(String),
						review_id: 1,
					});
				});
			});
	});

	test("Return comments in date descending order by default", () => {
		return request(app)
			.get("/api/reviews/1/comments")
			.expect(200)
			.then((result) => {
				const comments = result.body.comments;
				expect(comments).toBeSortedBy("created_at", {
					descending: true,
				});
			});
	});

	test("Responds with 404 error when applicable", () => {
		return request(app)
			.get("/api/reviews/999")
			.expect(404)
			.then((response) => {
				const errorMessage = response.body.msg;
				expect(errorMessage).toBe("Resource not found");
			});
	});

	test("Responds with 400 error when applicable", () => {
		return request(app)
			.get("/api/reviews/banana")
			.expect(400)
			.then((response) => {
				const errorMessage = response.body.msg;
				expect(errorMessage).toBe("Bad request");
			});
	});
});
