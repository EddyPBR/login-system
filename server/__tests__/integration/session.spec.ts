import request from "supertest";
import mongoose from "mongoose";

import app from "../../src/app";
import User from "../../src/models/User";

describe("Check the process in a authentication", () => {
  beforeAll(async () => {
    await User.deleteMany({});
    const newUser = await User.create({
      email: "admin@mail.com",
      password: "1234qwer",
    });
    expect(newUser).not.toBeFalsy();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should be FAIL to authenticate a user, because email is pooly formated", async () => {
    const response = await request(app).post("/sessions").send({
      email: "fakeadmin@mailcom",
      password: "1234qwer",
    });

    expect(response.status).toBe(400);
  });

  it("should be FAIL to authenticate a user, because password is pooly formated", async () => {
    const response = await request(app).post("/sessions").send({
      email: "fakeadmin@mailcom",
      password: "12qw",
    });

    expect(response.status).toBe(400);
  });

  it("should be FAIL to authenticate a user, because email not found", async () => {
    const response = await request(app).post("/sessions").send({
      email: "fakeadmin@mail.com",
      password: "1234qwer",
    });

    expect(response.status).toBe(404);
  });

  it("should be FAIL to authenticate a user, because password is incorrect", async () => {
    const response = await request(app).post("/sessions").send({
      email: "admin@mail.com",
      password: "qwer1234",
    });

    expect(response.status).toBe(401);
  });

  it("should be authenticate a user", async () => {
    const response = await request(app).post("/sessions").send({
      email: "admin@mail.com",
      password: "1234qwer",
    });

    expect(response.status).toBe(200);
  });

  it("should be authenticate a user, and check a route with needs a authentication to access", async () => {
    const authenticateUser = await request(app).post("/sessions").send({
      email: "admin@mail.com",
      password: "1234qwer",
    });

    expect(authenticateUser.status).toBe(200);

    const { token } = authenticateUser.body;

    expect(token).toBeDefined;

    const checkAuthentication = await request(app).get("/sessions").set("authorization", token).send({});

    expect(checkAuthentication.status).toBe(200);
  });

  it("should be create a token for reset password", async() => {
    const userResetPassword = await request(app).put("/sessions/recover-password").send({
      email: "admin@mail.com",
    });

    expect(userResetPassword.status).toBe(200);
  });

  it("should be FAIL to create a token for reset password, because email not found", async() => {
    const userResetPassword = await request(app).put("/sessions/recover-password").send({
      email: "adminnn@mail.com",
    });

    expect(userResetPassword.status).toBe(404);
  });

  it("should be FAIL to create a token for reset password, because email is poorly formated", async() => {
    const userResetPassword = await request(app).put("/sessions/recover-password").send({
      email: "adminnn@com",
    });

    expect(userResetPassword.status).toBe(400);
  });

  it("should be reset a password", async() => {
    const userToReset = await User.findOne({ email: "admin@mail.com" }).select(
      '+passwordResetToken passwordResetExpires email'
    );

    expect(userToReset).toBeDefined();

    const resetPassword = await request(app).put("/sessions/reset-password").send({
      email: userToReset.email,
      token: userToReset.passwordResetToken,
      password: "newPass123",
    });

    expect(resetPassword.status).toBe(200);
  });

  it("should be FAIL to reset a password, because email not found", async() => {
    const userToReset = await User.findOne({ email: "admin@mail.com" }).select(
      '+passwordResetToken passwordResetExpires email'
    );

    expect(userToReset).toBeDefined();

    const resetPassword = await request(app).put("/sessions/reset-password").send({
      email: "adminnnn@mail.com",
      token: userToReset.passwordResetToken,
      password: "newPass123",
    });

    expect(resetPassword.status).toBe(404);
  });

  it("should be Fail to reset a password, because token is invalid", async() => {
    const userToReset = await User.findOne({ email: "admin@mail.com" }).select(
      '+passwordResetToken passwordResetExpires email'
    );

    expect(userToReset).toBeDefined();

    const resetPassword = await request(app).put("/sessions/reset-password").send({
      email: userToReset.email,
      token: `sadhu12hj1e1o2kjvjJI23OJVJKj23o4vjkJV3IOJKOJv4k2jVKJVK35j3J3KJkbjBK3Jk3jKV3JKB3JKHVK3JV3OJPNOJ2PVIOKE2JKjIJWPO4I3J4NQKNJI3OVJKKQJENEJj4oijkjfoqjiwjeiqej3j1126j21kb1kebjm12k5m12kb1312`,
      password: "newPass123",
    });

    expect(resetPassword.status).toBe(403);
  });

});
