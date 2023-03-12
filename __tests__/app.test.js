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

describe("POST Comment by Review ID", () => {
	test("Returns posted comment and status code 201", () => {
		const newComment = {
			body: "Safe to say that it's fun for the whole family!",
			username: "bainesface",
		};
		return request(app)
			.post("/api/reviews/2/comments")
			.send(newComment)
			.expect(201)
			.then((response) => {
				const postComment = response.body.comment;
				expect(postComment).toEqual(
					expect.objectContaining({
						author: "bainesface",
						body: "Safe to say that it's fun for the whole family!",
						comment_id: expect.any(Number),
						review_id: 2,
						votes: 0,
					})
				);
			});
	});

	test("Returns posted comment, disregarding extra information, and status code 201", () => {
		const newComment = {
			body: "Here is a photo of my dog!",
			username: "mallionaire",
			img_url:
				"https://images.pexels.com/photos/3687770/pexels-photo-3687770.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
		};
		return request(app)
			.post("/api/reviews/2/comments")
			.send(newComment)
			.expect(201)
			.then((result) => {
				const postComment = result.body.comment;
				expect(postComment).toEqual(
					expect.objectContaining({
						author: "mallionaire",
						body: "Here is a photo of my dog!",
						comment_id: expect.any(Number),
						review_id: 2,
						votes: 0,
					})
				);
			});
	});

	test("Returns resource not found error when sending to review_id that doesn't exist, and status code of 404", () => {
		const newComment = {
			body: "This game is so much fun!",
			username: "philippaclaire9",
		};
		return request(app)
			.post("/api/reviews/1000/comments")
			.send(newComment)
			.expect(404)
			.then((response) => {
				const errorMessage = response.body.msg;
				expect(errorMessage).toBe("Resource not found");
			});
	});

	test("Returns resource not found error when posting with a username that doesn't exist, and status code of 404", () => {
		const newComment = {
			username: "spiderman123",
			body: "Incredibly fun!",
		};
		return request(app)
			.post("/api/reviews/1/comments")
			.send(newComment)
			.expect(404)
			.then((response) => {
				const errorMessage = response.body.msg;
				expect(errorMessage).toBe("Resource not found");
			});
	});

	test("Returns bad request error when attempting to post without correct information in required fields, and a status code of 400 ", () => {
		const newComment = {
			img_url:
				"https://images.pexels.com/photos/3687770/pexels-photo-3687770.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
		};
		return request(app)
			.post("/api/reviews/1/comments")
			.send(newComment)
			.expect(400)
			.then((response) => {
				const errorMessage = response.body.msg;
				expect(errorMessage).toBe("Bad request");
			});
	});
	test("Returns bad request error when given a id that is not a number, and a status code of 400", () => {
		const newComment = {
			body: "cool!",
			username: "philippaclaire9",
		};
		return request(app)
			.post("/api/reviews/banana/comments")
			.send(newComment)
			.expect(400)
			.then((response) => {
				const errorMessage = response.body.msg;
				expect(errorMessage).toBe("Bad request");
			});
	});
});

describe("PATCH review by review_id", () => {
	test("Responds with the updated review, and a status code of 200", () => {
		const voteIncrement = { inc_votes: 1 };
		return request(app)
			.patch("/api/reviews/1")
			.send(voteIncrement)
			.expect(200)
			.then(({ body }) => {
				expect(body).toEqual(
					expect.objectContaining({
						title: "Agricola",
						designer: "Uwe Rosenberg",
						owner: "mallionaire",
						review_img_url:
							"https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
						review_body: "Farmyard fun!",
						category: "euro game",
						created_at: "2021-01-18T10:00:20.514Z",
						votes: 2,
					})
				);
			});
	});

	test("Responds with decreased vote count from a negative increment, and a status code of 200", () => {
		const voteIncrement = { inc_votes: -1 };
		return request(app)
			.patch("/api/reviews/1")
			.send(voteIncrement)
			.expect(200)
			.then(({ body }) => {
				expect(body).toEqual(
					expect.objectContaining({
						title: "Agricola",
						designer: "Uwe Rosenberg",
						owner: "mallionaire",
						review_img_url:
							"https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
						review_body: "Farmyard fun!",
						category: "euro game",
						created_at: "2021-01-18T10:00:20.514Z",
						votes: 0,
					})
				);
			});
	});

	test("Responds with incremented votes whilst ignoring all extra keys, and a status code of 200 ", () => {
		const voteIncrement = {
			inc_votes: 10,
			fav_fruit: "banana",
			fav_drink: "pepsi",
		};
		return request(app)
			.patch("/api/reviews/1")
			.send(voteIncrement)
			.expect(200)
			.then(({ body }) => {
				expect(body).toEqual(
					expect.objectContaining({
						title: "Agricola",
						designer: "Uwe Rosenberg",
						owner: "mallionaire",
						review_img_url:
							"https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
						review_body: "Farmyard fun!",
						category: "euro game",
						created_at: "2021-01-18T10:00:20.514Z",
						votes: 11,
					})
				);
			});
	});

	test("Returns resource not found error when sending to review_id that doesn't exist, and status code of 404", () => {
		const voteIncrement = { inc_votes: 1 };
		return request(app)
			.patch("/api/reviews/1010")
			.send(voteIncrement)
			.expect(404)
			.then((response) => {
				const errorMessage = response.body.msg;
				expect(errorMessage).toBe("Resource not found");
			});
	});

	test("Returns bad request error when sending to review_id that is not a number, and status code of 400", () => {
		const voteIncrement = { inc_votes: 10 };
		return request(app)
			.patch("/api/reviews/banana")
			.send(voteIncrement)
			.expect(400)
			.then((response) => {
				const errorMessage = response.body.msg;
				expect(errorMessage).toBe("Bad request");
			});
	});

	test("Returns bad request error when not sending a valid integer as the inc_votes property, and status code of 400", () => {
		const voteIncrement = { inc_votes: null };
		return request(app)
			.patch("/api/reviews/1")
			.send(voteIncrement)
			.expect(400)
			.then((response) => {
				const errorMessage = response.body.msg;
				expect(errorMessage).toBe("Bad request");
			});
	});

	test("Returns bad request error when not sending an inc_votes key, and status code of 400", () => {
		const voteIncrement = { fav_fruit: "banana" };
		return request(app)
			.patch("/api/reviews/1")
			.send(voteIncrement)
			.expect(400)
			.then((response) => {
				const errorMessage = response.body.msg;
				expect(errorMessage).toBe("Bad request");
			});
	});
});
