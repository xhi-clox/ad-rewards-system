// Vercel Serverless Function for saving user data
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
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('POST /api/save-user called');
    console.log('Request body:', req.body);
    
    const { deviceId, userData } = req.body;

    if (!deviceId || !userData) {
      console.log('Missing deviceId or userData');
      return res.status(400).json({ error: 'Missing deviceId or userData' });
    }

    // Path to the JSON file
    const filePath = path.join(process.cwd(), 'data', 'users.json');
    console.log('Saving to file:', filePath);
    
    // Ensure data directory exists
    const dataDir = path.dirname(filePath);
    if (!fs.existsSync(dataDir)) {
      console.log('Creating data directory:', dataDir);
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Read existing data or create empty object
    let allUsers = {};
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        allUsers = JSON.parse(fileContent);
        console.log('Loaded existing users:', Object.keys(allUsers).length);
      } catch (error) {
        console.error('Error reading users file:', error);
        allUsers = {};
      }
    } else {
      console.log('Users file does not exist, creating new one');
    }

    // Update or add user data
    allUsers[deviceId] = {
      ...userData,
      lastUpdated: new Date().toISOString(),
      deviceId: deviceId
    };

    // Save back to file
    fs.writeFileSync(filePath, JSON.stringify(allUsers, null, 2));
    console.log('File saved successfully');

    // Log the update
    console.log(`User data saved for device: ${deviceId}`);

    return res.status(200).json({ 
      success: true, 
      message: 'User data saved successfully',
      deviceId: deviceId,
      totalUsers: Object.keys(allUsers).length
    });

  } catch (error) {
    console.error('Error saving user data:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      stack: error.stack
    });
  }
};
