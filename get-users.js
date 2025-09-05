// Vercel Serverless Function for retrieving all users
const fs = require('fs');
const path = require('path');

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Path to the JSON file
    const filePath = path.join(process.cwd(), 'data', 'users.json');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(200).json({});
    }

    // Read and parse the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const allUsers = JSON.parse(fileContent);

    // Add some metadata
    const response = {
      users: allUsers,
      totalUsers: Object.keys(allUsers).length,
      lastUpdated: new Date().toISOString()
    };

    // Log the request
    console.log(`Retrieved ${Object.keys(allUsers).length} users`);

    return res.status(200).json(response);

  } catch (error) {
    console.error('Error reading users file:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
