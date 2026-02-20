const request = require("supertest");
const app = require("../../app");
const userModel = require("../../models/userModel");

// Mock dependencies
jest.mock("bcryptjs", () => ({
  compare: jest.fn().mockResolvedValue(true),
  genSalt: jest.fn().mockResolvedValue("salt"),
  hash: jest.fn().mockResolvedValue("hashed"),
}));
process.env.JWT_SECRET = "testsecret";
jest.mock("../../models/userModel");
jest.mock("../../middlewares/auth", () => ({
  verifyJWT: (req, res, next) => {
    req.user = { id: 1, role: "librarian" }; // Mock user
    next();
  },
  authorize: () => (req, res, next) => next(),
}));
jest.mock("../../dbConfig", () => ({
  poolPromise: Promise.resolve({
    request: jest.fn(() => ({
      input: jest.fn().mockReturnThis(),
      query: jest.fn().mockResolvedValue({ recordset: [] }),
    })),
  }),
}));

describe("Auth Controller", () => {
  describe("register", () => {
    it("should register a new user successfully", async () => {
      userModel.getUserByUsername.mockResolvedValue(null);
      userModel.createUser.mockResolvedValue();

      const res = await request(app)
        .post("/auth/register")
        .send({ username: "testuser", password: "pass123", role: "member" });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("User registered successfully");
    });

    it("should return 400 for existing user", async () => {
      userModel.getUserByUsername.mockResolvedValue({ username: "testuser" });

      const res = await request(app)
        .post("/auth/register")
        .send({ username: "testuser", password: "pass123", role: "member" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Username already exists");
    });

    it("should return 400 for invalid role", async () => {
      const res = await request(app)
        .post("/auth/register")
        .send({ username: "testuser2", password: "pass123", role: "invalid" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Role must be member or librarian");
    });
  });

  describe("login", () => {
    it("should login successfully and return token", async () => {
      userModel.getUserByUsername.mockResolvedValue({
        username: "testuser",
        passwordHash: "$2a$10$hash", // Mock hashed password
        role: "member",
      });

      const res = await request(app)
        .post("/auth/login")
        .send({ username: "testuser", password: "pass123" });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it("should return 401 for invalid credentials", async () => {
      userModel.getUserByUsername.mockResolvedValue(null);

      const res = await request(app)
        .post("/auth/login")
        .send({ username: "invalid", password: "wrong" });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Invalid credentials");
    });
  });

  describe("getAllUsersController", () => {
    it("should return users list", async () => {
      userModel.getAllUsers.mockResolvedValue([
        { user_id: 1, username: "user1", role: "member" },
      ]);

      const res = await request(app).get("/auth/users");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        { user_id: 1, username: "user1", role: "member" },
      ]);
    });

    it("should handle errors", async () => {
      userModel.getAllUsers.mockRejectedValue(new Error("DB error"));

      const res = await request(app).get("/auth/users");

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Internal server error");
    });
  });
});
