const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // 🔥 1. Get header
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader); // Debug

    // ❌ No header
    if (!authHeader) {
      return res.status(401).json({ msg: "No token provided" });
    }

    // 🔥 2. Format check: Bearer token
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Invalid token format" });
    }

    // 🔥 3. Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "Token missing" });
    }

    // 🔥 4. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED USER:", decoded); // Debug

    // 🔥 5. Attach user to request
    req.user = decoded;

    next();

  } catch (err) {
    console.log("JWT ERROR:", err.message);

    return res.status(403).json({
      msg: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;