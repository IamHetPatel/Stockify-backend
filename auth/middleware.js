
const jwt = require("jsonwebtoken");

// Middleware to check if user has admin role
function isAdmin(req, res, next) {
  // Get the authorization header value (e.g. "Bearer <token>")
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Split the header value to get the token

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    // Verify the token and decode the payload
    const payload = jwt.verify(token, JWT_SECRET_KEY);

    // Get the user's role from the payload
    const role = payload.result.ROLE;

    if (role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    // User has admin role, continue to next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

// Middleware to check if user has user role
function isUser(req, res, next) {
    // Get the authorization header value (e.g. "Bearer <token>")
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Split the header value to get the token
  
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      // Verify the token and decode the payload
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
      // Get the user's role from the payload
      const role = payload.result.ROLE;
  
      if (role !== "user") {
        return res.status(403).json({ message: "Forbidden" });
      }
      // User has admin role, continue to next middleware or route handler
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
  
  module.exports = {
    isAdmin,
    isUser,
  };