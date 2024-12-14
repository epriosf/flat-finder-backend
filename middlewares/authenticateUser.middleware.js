import jwt from 'jsonwebtoken';
const authenticateUser = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Validate the token (example with JWT)
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user; // Attach the user info to the request
    next();
  } catch (error) {
    res.status(401).json({ error: `Invalid token ${error}` });
  }
};
export default authenticateUser;
