const jwt = require('jsonwebtoken');

const secret = process.env.secret;

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const tokenParts = token.split(' ');
  const toker = tokenParts[1];

  if (!toker) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  jwt.verify(toker, secret, {}, (err, info) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = info;
    next();
  });
};

module.exports = { verifyToken };
