import request from "supertest";
import mongoose from "mongoose";

import app from "../../src/app";
import User from "../../src/models/User";

describe("Users route", () => {
  // beforeAll(async () => {
  //   if (!process.env.MONGO_URL) {
  //     throw new Error("MongoDB server not initialized");
  //   }

  //   await mongoose.connect(process.env.MONGO_URL, {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //     useFindAndModify: true,
  //   });
  // });

  beforeAll(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should be create and save a user", async () => {
    const response = await request(app).post("/users").send({
      email: "newuser@mail.com",
      password: "1234abcd",
    });

    expect(response.status).toBe(201);
  });

  it("should be NOT create a user, because email already exists", async () => {
    const response = await request(app).post("/users").send({
      email: "newuser@mail.com",
      password: "1234abcd",
    });

    expect(response.status).toBe(409);
  });
});
