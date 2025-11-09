# Local Testing Setup (Without MongoDB)

## 🎯 Why This Change?

### Previous Setup (MongoDB):
- **Required MongoDB installation** - Had to install and run MongoDB service
- **Connection management** - Needed MONGODB_URI configuration
- **Service overhead** - Additional background process running
- **Setup complexity** - More steps to get started

### New Local Setup:
- **No database required** - Uses in-memory storage
- **Instant start** - No database connection needed
- **Simple testing** - Perfect for development and testing
- **Quick reset** - Just restart the server to reset data

## 🚀 How to Run the Project

### Option 1: Local Testing Mode (Recommended for Development)

1. **Start the Backend (Local Mode)**
   ```powershell
   cd backend
   npm run dev:local
   ```
   
   This will start the backend on `http://localhost:5000` with in-memory storage.

2. **Start the Frontend** (in a new terminal)
   ```powershell
   npm run dev
   ```
   
   This will start the frontend on `http://localhost:5173`

### Option 2: With MongoDB (Production Mode)

If you want to use MongoDB for testing with persistent data:

1. **Start MongoDB service**
   ```powershell
   # Run as Administrator
   net start MongoDB
   ```

2. **Add MongoDB URI to .env file in backend folder**
   ```
   MONGODB_URI=mongodb://localhost:27017/lcs-alliance
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

3. **Start the backend**
   ```powershell
   cd backend
   npm run dev
   ```

4. **Start the frontend**
   ```powershell
   npm run dev
   ```

## 👤 Test Users (Local Mode)

When running in local mode, these users are pre-created:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@test.com` | `admin123` |
| Student | `student@test.com` | `student123` |

You can also register new users - they'll be stored in memory until the server restarts.

## 🔍 Debug Endpoints (Local Mode Only)

- `GET http://localhost:5000/api` - Server info
- `GET http://localhost:5000/api/debug/users` - View all registered users

## ⚠️ Important Notes

### Local Mode:
- ✅ No database installation needed
- ✅ Fast setup and restart
- ✅ Perfect for UI development and testing
- ⚠️ **Data resets** when server restarts
- ⚠️ **Not secure** - passwords stored in plain text
- ⚠️ **For testing only** - Never use in production!

### MongoDB Mode:
- ✅ Persistent data storage
- ✅ Production-ready
- ✅ Secure password hashing with bcrypt
- ✅ Proper JWT authentication
- ⚠️ Requires MongoDB installation
- ⚠️ More setup steps

## 🔄 Switching Between Modes

### Currently Using: Local Mode (Default)
Backend script: `npm run dev:local`

### To Switch to MongoDB Mode:
1. Install MongoDB
2. Configure `.env` in backend folder with `MONGODB_URI`
3. Run `npm run dev` instead of `npm run dev:local`

## 📝 Project Structure

```
backend/
├── src/
│   ├── server.ts          # MongoDB version (production)
│   ├── server-local.ts    # Local testing version (new!)
│   ├── controllers/       # Auth controllers (for MongoDB)
│   ├── models/            # Mongoose models (for MongoDB)
│   └── routes/            # API routes (for MongoDB)
└── package.json
```

## 🎓 Why MongoDB Was Used Previously

MongoDB was implemented to provide:
1. **Real database experience** - Learning to work with databases
2. **User authentication** - Proper registration/login system
3. **Data persistence** - Saving user accounts, classes, videos
4. **Scalability** - Ready for production deployment
5. **Industry standard** - Common stack for web applications

For local testing and development, the in-memory version is simpler and faster!
