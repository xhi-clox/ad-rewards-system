// Vercel Serverless Function for retrieving all users
const fs = require('fs');
const path = require('path');

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
    
    // Path to the JSON file
    const filePath = path.join(process.cwd(), 'data', 'users.json');
    console.log('Looking for file at:', filePath);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log('File does not exist, returning empty users');
      return res.status(200).json({ 
        users: {},
        totalUsers: 0,
        lastUpdated: new Date().toISOString(),
        message: 'No users file found'
      });
    }

    // Read and parse the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const allUsers = JSON.parse(fileContent);

    // Add some metadata
    const response = {
      users: allUsers,
      totalUsers: Object.keys(allUsers).length,
      lastUpdated: new Date().toISOString(),
      message: 'Users retrieved successfully'
    };

    // Log the request
    console.log(`Retrieved ${Object.keys(allUsers).length} users`);

    return res.status(200).json(response);

  } catch (error) {
    console.error('Error reading users file:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      stack: error.stack
    });
  }
};
