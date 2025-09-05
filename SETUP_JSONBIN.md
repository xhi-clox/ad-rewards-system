# JSONBin Setup Guide

## Why JSONBin?
The current in-memory storage doesn't work across different Vercel function instances. JSONBin provides persistent storage that all function instances can access.

## Setup Steps:

### 1. Create JSONBin Account
1. Go to [jsonbin.io](https://jsonbin.io)
2. Sign up for a free account
3. Verify your email

### 2. Create a Bin
1. After logging in, click "Create Bin"
2. Name it something like "galaxy-earn-users"
3. Copy the **Bin ID** (looks like: `507f1f77bcf86cd799439011`)

### 3. Get API Key
1. Go to your profile/settings
2. Find your **X-Master-Key**
3. Copy the API key

### 4. Update the Code
Replace these values in `api/storage.js`:

```javascript
const JSONBIN_API_KEY = 'your-actual-api-key-here';
const JSONBIN_BIN_ID = 'your-actual-bin-id-here';
```

### 5. Deploy
Push the changes to GitHub and Vercel will redeploy.

## Alternative: Use Environment Variables (Recommended)

Instead of hardcoding the keys, use Vercel environment variables:

1. In Vercel dashboard, go to your project settings
2. Add these environment variables:
   - `JSONBIN_API_KEY` = your API key
   - `JSONBIN_BIN_ID` = your bin ID

3. Update `api/storage.js`:
```javascript
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;
const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID;
```

## Testing
After setup, test by:
1. Using the app on different devices
2. Checking the admin panel
3. All users should now be visible across devices

## Free Limits
- 10,000 requests per month
- 1MB storage per bin
- Perfect for small to medium apps
