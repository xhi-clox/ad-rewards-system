// Vercel Serverless Function for retrieving all users
const storage = require('./storage');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('GET /api/get-users called');
    
    // Get all users from shared storage
    const users = await storage.getAllUsers();
    const stats = await storage.getStats();

    const response = {
      users: users,
      totalUsers: stats.totalUsers,
      lastUpdated: stats.lastUpdated,
      message: 'Users retrieved successfully from memory storage'
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error('Error retrieving users:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      stack: error.stack
    });
  }
};
