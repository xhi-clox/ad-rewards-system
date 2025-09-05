// Vercel Serverless Function for saving user data
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

    // Save user data using shared storage
    const savedUser = storage.saveUser(deviceId, userData);
    const stats = storage.getStats();

    return res.status(200).json({ 
      success: true, 
      message: 'User data saved successfully',
      deviceId: deviceId,
      totalUsers: stats.totalUsers,
      user: savedUser
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
