/**
 * TODO: Implement JWT auth middleware.
 * - Read Authorization: Bearer <token>
 * - Verify with jsonwebtoken
 * - Attach payload to req.user
 * - Call next() or return 401
 */

 const jwt = require('jsonwebtoken');

 // Mock JWT secret
 const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Authentication required',
        details: { code: 'MISSING_TOKEN' }
      });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      return res.status(401).json({
        message: 'Authentication required',
        details: { code: 'EMPTY_TOKEN' }
      });
    }

     // Verify JWT token
     const decoded = jwt.verify(token, JWT_SECRET);
    
     // Attach payload to req.user
     req.user = decoded;
     
     // Call next() to continue to the next middleware/route
     next();
     
   } catch (error) {
     if (error.name === 'JsonWebTokenError') {
       return res.status(401).json({
         message: 'Invalid token',
         details: { code: 'INVALID_TOKEN' }
       });
     }
     
     if (error.name === 'TokenExpiredError') {
       return res.status(401).json({
         message: 'Token expired',
         details: { code: 'EXPIRED_TOKEN' }
       });
     }
     
     return res.status(401).json({
       message: 'Authentication failed',
       details: { code: 'AUTH_ERROR' }
     });
   }
 }
 

module.exports = { requireAuth };
