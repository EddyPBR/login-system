import request from "supertest";
import mongoose from "mongoose";

import app from "../../src/app";
import User from "../../src/models/User";

describe("Test a CRUD for user route", () => {
  beforeAll(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // .CREATE
  it("should be create and save a user", async () => {
    const response = await request(app).post("/users").send({
      email: "newuser@mail.com",
      password: "1234abcd",
    });

    expect(response.status).toBe(201);
  });

  it("should be FAIL to create a user, because email already exists", async () => {
    const response = await request(app).post("/users").send({
      email: "newuser@mail.com",
      password: "1234abcd",
    });

    expect(response.status).toBe(409);
  });

  it("should be FAIL to create a user, because email is pooly formated", async () => {
    const response = await request(app).post("/users").send({
      email: "newuser@com",
      password: "1234abcd",
    });

    expect(response.status).toBe(400);
  });

  it("should be FAIL to create a user, because password is pooly formated", async () => {
    const response = await request(app).post("/users").send({
      email: "newuser@gmail.com",
      password: "12qw",
    });

    expect(response.status).toBe(400);
  });

  // LIST AND SEARCH
  it("should be list all registered user", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
  });

  it("should be find a user by _id param", async () => {
    // The two first line is only to get the _id for update
    const { _id } = await User.findOne({ email: "newuser@mail.com" }, "_id");
    expect(_id).not.toBeFalsy();

    const response = await request(app).get(`/users/${_id}`);
    expect(response.status).toBe(200);
  });

  it("should be FAIL to find a user by _id param, because _id is incorrectly", async () => {
    const _id = "5fdb68ef55619f033762babc";

    const response = await request(app).get(`/users/${_id}`);
    expect(response.status).toBe(404);
  });

  it("should be FAIL to find a user by _id param, because _id is pooly formated", async () => {
    const _id = null;

    const response = await request(app).get(`/users/${_id}`);
    expect(response.status).toBe(400);
  });

  // UPDATE
  it("should be update a user succesfully", async () => {
    // The two first line is only to get the _id for update
    const { _id } = await User.findOne({ email: "newuser@mail.com" }, "_id");
    expect(_id).not.toBeFalsy();

    const response = await request(app).put(`/users/${_id}`).send({
      email: "newuser@mail.com",
      password: "abcd1234",
    });

    expect(response.status).toBe(200);
  });

  it("should be FAIL to update a user, because _id is poorly formated", async () => {
    const _id = undefined;

    const response = await request(app).put(`/users/${_id}`).send({
      email: "updateuser@mail.com",
      password: "abcd1234",
    });

    expect(response.status).toBe(400);
  });

  it("should be FAIL to update a user, because _id is incorectly", async () => {
    const _id = "5fdb68ef55619f033762babc";

    const response = await request(app).put(`/users/${_id}`).send({
      email: "updateuser@mail.com",
      password: "abcd1234",
    });

    expect(response.status).toBe(404);
  });

  it("should be FAIL to update a user, because email is poorly formated", async () => {
    const _id = "5fdb68ef55619f033762babc";

    const response = await request(app).put(`/users/${_id}`).send({
      email: "updateuser@com",
      password: "abcd1234",
    });

    expect(response.status).toBe(400);
  });

  it("should be FAIL to update a user, because passsword is poorly formated", async () => {
    const _id = "5fdb68ef55619f033762babc";

    const response = await request(app).put(`/users/${_id}`).send({
      email: "updateuser@mail.com",
      password: "ab12",
    });

    expect(response.status).toBe(400);
  });

  // DELETE
  it("should be delete a user", async () => {
    // The two first line is only to get the _id for update
    const { _id } = await User.findOne({ email: "newuser@mail.com" }, "_id");
    expect(_id).not.toBeFalsy();

    const response = await request(app).delete(`/users/${_id}`).send();

    expect(response.status).toBe(200);
  });

  it("should be FAIL to delete a user, because _id is incorectly", async () => {
    const _id = "5fdb68ef55619f033762babc";

    const response = await request(app).delete(`/users/${_id}`).send();

    expect(response.status).toBe(404);
  });

  it("should be FAIL to delete a user, because _id is not specified", async () => {
    const _id = null;

    const response = await request(app).delete(`/users/${_id}`).send();

    expect(response.status).toBe(400);
  });
});
