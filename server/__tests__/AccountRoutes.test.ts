import { Response } from "express";
import request from "supertest";
import UserSchema from "../schemas/UserSchema";
import { app } from "../server";

describe("AccountRoutes", () => {
  let token: string;

  beforeAll(async () => {
    // Login before running tests
    const response = await request(app)
      .post("/accounting/login")
      .send({ username: "admin", password: "password" });

    token = response.header["set-cookie"][0].split(";")[0].split("=")[1];
  });

  afterAll(async () => {
    // Logout after running tests
    await request(app)
      .post("/accounting/logout")
      .set("Cookie", `auth-jwt=${token}`)
      .expect(200);
  });

  describe("POST /accounting/signup", () => {
    it("should create a new user", async () => {
      const response = await request(app)
        .post("/accounting/signup")
        .send({
          username: "newuser",
          email: "newuser@example.com",
          password: "newpassword",
          privilege: 4,
        })
        .expect(200);

      expect(response.body).toEqual({});
    });

    it("should return an error if the username is already in use", async () => {
      const response = await request(app)
        .post("/accounting/signup")
        .send({
          username: "testuser",
          email: "testuser@example.com",
          password: "testpassword",
          privilege: 4,
        })
        .expect(409);

      expect(response.body).toEqual({ message: "Username già in uso" });
    });

    it("should return an error if the email is already in use", async () => {
      const response = await request(app)
        .post("/accounting/signup")
        .send({
          username: "newuser2",
          email: "testuser@example.com",
          password: "newpassword",
          privilege: 4,
        })
        .expect(409);

      expect(response.body).toEqual({ message: "Email già in uso" });
    });
  });

  describe("POST /api/account/login", () => {
    it("should log in a user and return a JWT token", async () => {
      const response = await request(app)
        .post("/accounting/login")
        .send({ username: "testuser", password: "testpassword" })
        .expect(200);

      expect(response.header["set-cookie"][0]).toContain("auth-jwt=");
    });

    it("should return an error if the username or password is incorrect", async () => {
      const response = await request(app)
        .post("/accounting/login")
        .send({ username: "testuser", password: "wrongpassword" })
        .expect(401);

      expect(response.body).toEqual({ message: "Credenziali non valide" });
    });
  });

  describe("POST /api/account/logout", () => {
    it("should log out a user and delete the JWT token", async () => {
      const response = await request(app)
        .post("/accounting/logout")
        .set("Cookie", `auth-jwt=${token}`)
        .expect(200);

      expect(response.header["set-cookie"][0]).toContain(
        "auth-jwt=; Max-Age=-1"
      );
    });

    it("should return an error if the user is not authenticated", async () => {
      const response = await request(app)
        .post("/accounting/logout")
        .expect(401);

      expect(response.body).toEqual({ status: "error", error: "Unauthorized" });
    });
  });

  describe("GET /api/account/verify", () => {
    it("should return the user's privilege if the JWT token is valid", async () => {
      const response = await request(app)
        .get("/accounting/verify")
        .set("Cookie", `auth-jwt=${token}`)
        .expect(200);

      expect(response.body).toEqual({ role: 4 });
    });

    it("should return an error if the JWT token is invalid", async () => {
      const response = await request(app)
        .get("/accounting/verify")
        .set("Cookie", "auth-jwt=invalidtoken")
        .expect(500);

      expect(response.body).toEqual({
        error: "Autenticazione del token fallita!",
      });
    });
  });
});
