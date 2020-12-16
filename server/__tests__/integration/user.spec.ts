import request from "supertest";

import app from "../../src/app";

describe("Users route", () => {
  it("should be a teste to user index route", async () => {
    await request(app).get("/users");
  });
});
