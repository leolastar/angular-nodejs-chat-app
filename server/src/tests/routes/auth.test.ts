import request from "supertest";
import { app } from "../../app";
import { sequelize } from "../../config/database";
import { beforeAll, describe, expect, it, afterAll } from "mocha";

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe("Auth routes", () => {
  it("signup -> 201", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "secret123",
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it("login -> 200", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "john@example.com", password: "secret123" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
afterAll(async () => {
  await sequelize.close();
});
