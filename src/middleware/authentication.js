const jwt = require("jsonwebtoken");

const secretKey = process.env.AUTH_SECRET_KEY;

const verifyToken = (req, res, next) => {
  // Extract the token from the request header
  const token = req.headers["authorization"];

  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "No token provided." });
  }

  // Verify the token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ success: false, message: "Failed to authenticate token." });
    }

    // Save the decoded user information for further use in the request
    req.user = decoded;

    // Call next to pass control to the next middleware or route handler
    next();
  });
};

function generateToken(userId, email) {
  // Payload contains user information that you want to include in the token
  const payload = {
    user_id: userId,
    email: email,
  };

  // Sign the token with your secret key and set an expiration time (e.g., 1 hour)
  const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

  return token;
}

module.exports = {
  verifyToken,
  generateToken,
};
