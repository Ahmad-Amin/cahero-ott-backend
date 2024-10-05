const jwt = require('jsonwebtoken');

// Define the middleware function for authenticating JWT tokens
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Split "Bearer <token>"
    req.token = token.split(' ')[1];

    // Verify and decode the token
    const decoded = jwt.verify(req.token, process.env.JWT_SECRET);

    // Attach the userId from the decoded token
    req.user = { userId: decoded.id };

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid', error: err.message });
  }
};

module.exports = authMiddleware;
