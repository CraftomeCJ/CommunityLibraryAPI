const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} = require("../models/userModel");

// Register
async function register(req, res) {
  const { username, password, role } = req.body;

  if (
    !username ||
    !password ||
    !role ||
    !["member", "librarian"].includes(role)
  ) {
    return res.status(400).json({
      message: "username, password, role (member|librarian) required",
    });
  }

  if (role !== "member" && role !== "librarian") {
    return res
      .status(400)
      .json({ message: "Role must be member or librarian" });
  }

  try {
    const existingUser = await userModel.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await userModel.createUser(username, hashedPassword, role);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Login
async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "username and password required" });
  }

  try {
    const user = await userModel.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: user.user_id,
      username: user.username,
      role: user.role,
    };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || "YsOuFnAc2/sf2MRGfKqmHcuia7XOkazRfXPQjdpE3HI=",
      { expiresIn: "5m" },
    );

    res.json({ token });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getAllUsersController(req, res) {
  try {
    const filters = {
      role: req.query.role,
      username: req.query.username,
    };
    const users = await userModel.getAllUsers(filters);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getUserByIdController(req, res) {
  try {
    const user = await getUserById(Number(req.params.userId));
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function updateUserRoleController(req, res) {
  const { role } = req.body;
  if (!role || !["member", "librarian"].includes(role)) {
    return res
      .status(400)
      .json({ message: "Role must be member or librarian" });
  }
  try {
    const ok = await updateUserRole(Number(req.params.userId), role);
    if (!ok) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Role updated" });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteUserController(req, res) {
  try {
    const ok = await deleteUser(Number(req.params.userId));
    if (!ok) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  register,
  login,
  getAllUsersController,
  getUserByIdController,
  updateUserRoleController,
  deleteUserController,
};
