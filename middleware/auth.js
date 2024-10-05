const jwt = require('jsonwebtoken');

// Define the middleware function for authenticating JWT tokens
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
  
    req.token = token.split(' ')[1];

    const decoded = jwt.verify(req.token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId, email: decoded.email };

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid', error: err.message });
  }
};

module.exports = authMiddleware;
