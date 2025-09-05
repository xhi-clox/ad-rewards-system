// Shared storage module for Vercel serverless functions
// Using JSONBin.io for persistent cross-device storage

const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY || 'your-jsonbin-api-key';
const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID || 'your-bin-id';

// Fallback in-memory storage
let userStorage = {};

// JSONBin API functions
async function saveToJSONBin(data) {
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`JSONBin API error: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Data saved to JSONBin:', result);
    return result;
  } catch (error) {
    console.error('Failed to save to JSONBin:', error);
    throw error;
  }
}

async function loadFromJSONBin() {
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': JSONBIN_API_KEY
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log('JSONBin not found, returning empty data');
        return {};
      }
      throw new Error(`JSONBin API error: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Data loaded from JSONBin:', result);
    return result.record || {};
  } catch (error) {
    console.error('Failed to load from JSONBin:', error);
    return {};
  }
}

module.exports = {
  // Save user data
  saveUser: async (deviceId, userData) => {
    try {
      // Try to save to JSONBin first
      const allUsers = await loadFromJSONBin();
      allUsers[deviceId] = {
        ...userData,
        lastUpdated: new Date().toISOString(),
        deviceId: deviceId
      };
      
      await saveToJSONBin(allUsers);
      console.log(`✅ User saved to JSONBin: ${deviceId}, Total users: ${Object.keys(allUsers).length}`);
      return allUsers[deviceId];
      
    } catch (error) {
      console.error('JSONBin failed, using local storage:', error);
      
      // Fallback to local storage
      userStorage[deviceId] = {
        ...userData,
        lastUpdated: new Date().toISOString(),
        deviceId: deviceId
      };
      console.log(`⚠️ User saved locally: ${deviceId}, Total users: ${Object.keys(userStorage).length}`);
      return userStorage[deviceId];
    }
  },

  // Get all users
  getAllUsers: async () => {
    try {
      // Try to load from JSONBin first
      const users = await loadFromJSONBin();
      console.log(`✅ Retrieved ${Object.keys(users).length} users from JSONBin`);
      return users;
      
    } catch (error) {
      console.error('JSONBin failed, using local storage:', error);
      console.log(`⚠️ Retrieved ${Object.keys(userStorage).length} users from local storage`);
      return userStorage;
    }
  },

  // Get user by device ID
  getUser: async (deviceId) => {
    try {
      const users = await loadFromJSONBin();
      return users[deviceId] || null;
    } catch (error) {
      return userStorage[deviceId] || null;
    }
  },

  // Get storage stats
  getStats: async () => {
    try {
      const users = await loadFromJSONBin();
      return {
        totalUsers: Object.keys(users).length,
        lastUpdated: new Date().toISOString(),
        storage: 'JSONBin'
      };
    } catch (error) {
      return {
        totalUsers: Object.keys(userStorage).length,
        lastUpdated: new Date().toISOString(),
        storage: 'Local'
      };
    }
  },

  // Clear all data (for testing)
  clearAll: async () => {
    try {
      await saveToJSONBin({});
      console.log('All user data cleared from JSONBin');
    } catch (error) {
      userStorage = {};
      console.log('All user data cleared from local storage');
    }
  }
};
