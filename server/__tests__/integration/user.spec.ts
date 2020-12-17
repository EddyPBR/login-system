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

  it("should be update a user succesfully", async () => {
    // The two first line is only to get the _id for update
    const { _id } = await User.findOne({ email: "newuser@mail.com" }, "_id");
    expect(_id).not.toBeFalsy();

    const response = await request(app).put(`/users/${_id}`).send({
      email: "updateuser@mail.com",
      password: "abcd1234",
    });

    expect(response.status).toBe(201);
  });

  it("should be FAIL to update a user", async () => {
    const _id = "5fdb68ef55619f033762babc"

    const response = await request(app).put(`/users/${_id}`).send({
      email: "updateuser@mail.com",
      password: "abcd1234",
    });

    expect(response.status).toBe(500);
  });

  
});
