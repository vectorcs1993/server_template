import jsonwebtoken from 'jsonwebtoken';
import config from '../config.js';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split('Bearer ')[1];
  if (!token) return res.sendStatus(401);

  jsonwebtoken.verify(token, config.JWT_ACCESS_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403); 
    }
    req.user = user;
    next();
  });
}

export function generateAccessToken(data) {
    return jsonwebtoken.sign(data,
         config.JWT_ACCESS_SECRET,
          { expiresIn: config.JWT_ACCESS_EXPIRES_IN });
}

export function generateRefreshToken(data) {
    return jsonwebtoken.sign(data, 
        config.JWT_REFRESH_SECRET, 
        { expiresIn: config.JWT_REFRESH_EXPIRES_IN });
}