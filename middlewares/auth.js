const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "YsOuFnAc2/sf2MRGfKqmHcuia7XOkazRfXPQjdpE3HI=",
    (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      req.user = decoded;
      next();
    },
  );
};

const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

module.exports = { verifyJWT, authorize };
