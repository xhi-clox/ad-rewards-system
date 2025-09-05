// Vercel Serverless Function for saving user data
const fs = require('fs');
const path = require('path');

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { deviceId, userData } = req.body;

    if (!deviceId || !userData) {
      return res.status(400).json({ error: 'Missing deviceId or userData' });
    }

    // Path to the JSON file
    const filePath = path.join(process.cwd(), 'data', 'users.json');
    
    // Ensure data directory exists
    const dataDir = path.dirname(filePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Read existing data or create empty object
    let allUsers = {};
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        allUsers = JSON.parse(fileContent);
      } catch (error) {
        console.error('Error reading users file:', error);
        allUsers = {};
      }
    }

    // Update or add user data
    allUsers[deviceId] = {
      ...userData,
      lastUpdated: new Date().toISOString(),
      deviceId: deviceId
    };

    // Save back to file
    fs.writeFileSync(filePath, JSON.stringify(allUsers, null, 2));

    // Log the update
    console.log(`User data saved for device: ${deviceId}`);

    return res.status(200).json({ 
      success: true, 
      message: 'User data saved successfully',
      deviceId: deviceId
    });

  } catch (error) {
    console.error('Error saving user data:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
