const jwt = require('jsonwebtoken');

// Define the middleware function for authenticating JWT tokens
const authMiddleware = (req, res, next) => {
  // Extract the Authorization header containing the token
  const token = req.header('Authorization');
  if (!token) {
    // If no token is present, deny access with a 401 Unauthorized status
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Store the original token in req.token
    req.token = token.split(' ')[1];

    // Attempt to verify the token and extract the payload
    const decoded = jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET);

    // Attach the decoded user's ID and email to the request object
    req.user = { userId: decoded.userId, email: decoded.email };

    // Continue to the next middleware or request handler
    next();
  } catch (err) {
    // If token verification fails, return a 401 Unauthorized status
    res.status(401).json({ message: 'Token is not valid', error: err.message });
  }
};

module.exports = authMiddleware;
