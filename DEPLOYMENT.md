# Deployment Guide

This guide outlines the steps to deploy the application in a production environment.

## 1. Database (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster.
2. Under "Database Access", create a database user with a secure password.
3. Under "Network Access", allow access from anywhere (`0.0.0.0/0`) or whitelist your backend server IP.
4. Click "Connect", choose "Connect your application", and copy the connection string.
5. Replace `<password>` in the string with your DB user password. This is your `MONGO_URI`.

## 2. Backend Deployment (Render or Railway)

### Using Render (render.com)
1. Push your code to a GitHub repository.
2. Log into Render and click **New > Web Service**.
3. Connect your GitHub repository.
4. Settings:
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start` (Make sure you add `"start": "node server.js"` to `package.json` scripts)
5. **Environment Variables:** Add the following:
   - `NODE_ENV=production`
   - `MONGO_URI=your_atlas_connection_string`
   - `JWT_SECRET=a_very_secure_random_string`
   - `JWT_EXPIRE=30d`
   - `PORT=10000` (Render defaults)
   - `TRANSLATION_API_KEY=your_google_or_libre_api_key`
6. Click **Create Web Service**. Wait for the build to finish. Copy the public URL (e.g., `https://translator-backend.onrender.com`).

## 3. Frontend Deployment (Netlify or Vercel)

### Preparation
1. In your `frontend/app.js` file, change the `API_URL` constant from `http://localhost:5000/api` to your deployed backend URL.
   ```javascript
   // Change this:
   const API_URL = 'http://localhost:5000/api';
   // To this:
   const API_URL = 'https://translator-backend.onrender.com/api';
   ```

### Using Netlify (netlify.com)
1. Log into Netlify.
2. You can either deploy via GitHub or drag-and-drop the `frontend` folder directly into the "Sites" tab.
3. If using GitHub, choose your repository, set the **Publish directory** to `frontend`, and click **Deploy**.
4. Your application will be live immediately!

## 4. Final Verification
- Visit your Netlify frontend URL.
- Test user registration.
- Verify that translation requests successfully reach your Render backend and process the response.
