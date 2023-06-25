/* eslint-disable no-undef */
const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../../app");

const User = require("../../models/users-model");

const { DB_HOST_TEST, PORT } = process.env;

describe("test signup route", () => {
  let server = null;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST_TEST);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  beforeEach(() => {});

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("test correct signup response", async () => {
    const signupData = {
      email: "viper66@mail.com",
      password: "viper66",
    };
    const { body, statusCode } = await request(app)
      .post("/api/users/register")
      .send(signupData);

    expect(statusCode).toBe(201);
    expect(body.user).toBeDefined();
    expect(typeof body.user.email).toBe("string");
    expect(typeof body.user.subscription).toBe("string");
  });
});
