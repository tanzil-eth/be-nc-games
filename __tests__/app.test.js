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
				const expected = {
					title: "Agricola",
					designer: "Uwe Rosenberg",
					owner: "mallionaire",
					review_id: 1,
					review_img_url:
						"https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
					review_body: "Farmyard fun!",
					category: "euro game",
					created_at: "2021-01-18T10:00:20.514Z",
					votes: 1,
				};
				expect(result.body.reviews[0]).toEqual(expected);
				expect(result.body.reviews.length).toBe(13);
			});
	});
});
