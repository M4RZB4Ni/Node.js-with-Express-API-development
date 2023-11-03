const jwt = require("jsonwebtoken");
const passport = require('passport');

const BearerStrategy = require("passport-http-bearer").Strategy;

require("dotenv").config();
const { AppError } = require('../utils/appError');

const secretKey = process.env.AUTH_SECRET_KEY;

// const verifyToken = (req, res, next) =>
// {
//   // Extract the entire authorization header
//   const authHeader = req.headers["authorization"];

//   if (!authHeader)
//   {
//     next(new AppError("No token provided.", 403));
//   }

//   // Check if the header starts with "Bearer "
//   if (authHeader.startsWith("Bearer "))
//   {
//     // Remove "Bearer " to extract the actual token
//     const token = authHeader.substring(7);

//     // Verify the token
//     jwt.verify(token, secretKey, (err, decoded) =>
//     {
//       if (err)
//       {
//         next(new AppError("Failed to authenticate token.", 401));

//       }

//       // Save the decoded user information for further use in the request
//       req.user = decoded;
//       next();
//     });
//   } else
//   {

//     next(new AppError('Invalid token format. It should start with "Bearer "', 401));
//   }
// };

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
passport.use(new BearerStrategy(
  function (token, done)
  {
    try
    {

      // Verify the token
      jwt.verify(token, secretKey, (err, decoded) =>
      {
        if (err)
        {
          console.log(`we have error--> ${err}`);
          // next(new AppError("Failed to authenticate token.", 401));
          return done(new AppError("Failed to authenticate token.", 401));
        }

        // Save the decoded user information for further use in the request
        // req.user = decoded;
        return done(null, decoded, { scope: 'all' });
        // next();
      });


    } catch (err)
    {
      console.log(`we have catch error--> ${err}`);

      return done(err);

    }
  }
));


module.exports = {
  initialize: passport.initialize(),
  authentication: passport.authenticate('bearer', { session: false }),
  generateToken,
};
