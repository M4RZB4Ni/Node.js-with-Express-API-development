const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.AUTH_SECRET_KEY;
// const secretKey =
//   "c8c3a8b1d1e04ef2a899e8e7a574f40555b62a371bd8f4e9b0a558d599de4fa5";

const verifyToken = (req, res, next) =>
{
  // Extract the entire authorization header
  const authHeader = req.headers["authorization"];

  if (!authHeader)
  {
    return res
      .status(403)
      .json({ success: false, message: "No token provided." });
  }

  // Check if the header starts with "Bearer "
  if (authHeader.startsWith("Bearer "))
  {
    // Remove "Bearer " to extract the actual token
    const token = authHeader.substring(7);

    // Verify the token
    jwt.verify(token, secretKey, (err, decoded) =>
    {
      if (err)
      {
        return res
          .status(401)
          .json({ success: false, message: "Failed to authenticate token." });
      }

      // Save the decoded user information for further use in the request
      req.user = decoded;
      next();
    });
  } else
  {
    return res.status(401).json({
      success: false,
      message: 'Invalid token format. It should start with "Bearer "',
    });
  }
};

function generateToken(userId, email)
{
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
