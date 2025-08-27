/**
 * TODO: Implement POST /api/auth/login
 * - Body: { email, password }
 * - Validate user with DB (Knex + bcryptjs)
 * - Return { token } (JWT) on success
 */
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Mock JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Mock users database 
const mockUsers = [
  {
    id: 1,
    email: 'admin@vibrantlms.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    role: 'admin',
    name: 'Admin User'
  },
  {
    id: 2,
    email: 'tech@vibrantlms.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    role: 'technician',
    name: 'Lab Technician'
  }
];

router.post('/auth/login', (_req, res) => { try {
  const { email, password } = req.body;
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required',
      details: { email: !email ? 'REQUIRED' : null, password: !password ? 'REQUIRED' : null }
    });
  }
  
  // Find user in mock database
  const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    return res.status(401).json({
      message: 'Invalid credentials',
      details: { email: 'NOT_FOUND' }
    });
  }
  
  // Verify password with bcryptjs
  const isValidPassword = await bcrypt.compare(password, user.password);
  
  if (!isValidPassword) {
    return res.status(401).json({
      message: 'Invalid credentials',
      details: { password: 'INCORRECT' }
    });
  }
  
  // Create JWT payload
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  };
  
  // Generate JWT token
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h' // Token expires in 24 hours
  });
  
  // Return success with token
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    }
  });
  
} catch (error) {
  console.error('Login error:', error);
  res.status(500).json({
    message: 'Internal server error',
    details: { code: 'SERVER_ERROR' }
  });
}
});

// Add a route to verify token validity
router.get('/auth/verify', (req, res) => {
const authHeader = req.headers.authorization;

if (!authHeader || !authHeader.startsWith('Bearer ')) {
  return res.status(401).json({ valid: false, message: 'No token provided' });
}

const token = authHeader.substring(7);

try {
  const decoded = jwt.verify(token, JWT_SECRET);
  res.json({ valid: true, user: decoded });
} catch (error) {
  res.status(401).json({ valid: false, message: 'Invalid token' });
}
});

module.exports = router;
