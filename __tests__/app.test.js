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
