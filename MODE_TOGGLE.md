# 🔄 Switching Between Demo and Production Mode

## Current Mode: **DEMO MODE** ✅

---

## To Enable DEMO MODE (No Backend Needed):

### File: `src/context/AuthContext.tsx`

Find this line near the top:
```typescript
const DEMO_MODE = true;  // ✅ DEMO MODE ENABLED
```

**What This Does:**
- ✅ No backend/MongoDB required
- ✅ Mock authentication with demo credentials
- ✅ Works instantly
- ✅ Perfect for presentations

**Demo Credentials:**
- Admin: `admin@demo.com` / `admin`
- Student: `student@demo.com` / `student`

---

## To Enable PRODUCTION MODE (With Backend):

### File: `src/context/AuthContext.tsx`

Change this line:
```typescript
const DEMO_MODE = false;  // ✅ PRODUCTION MODE ENABLED
```

**Requirements:**
- ❗ Backend server must be running
- ❗ MongoDB must be installed and running
- ❗ Environment variables configured

**Production Setup:**
1. Start MongoDB: `net start MongoDB` (as Admin)
2. Start Backend: `cd backend && npm run dev`
3. Start Frontend: `npm run dev`

---

## Quick Comparison

| Feature | Demo Mode | Production Mode |
|---------|-----------|-----------------|
| Backend Required | ❌ No | ✅ Yes |
| MongoDB Required | ❌ No | ✅ Yes |
| Setup Time | 🚀 Instant | ⏱️ 5-10 mins |
| Data Persistence | 💾 localStorage | 💾 Database |
| Authentication | 🎭 Mock | 🔒 Real (bcrypt + JWT) |
| Best For | 🎬 Demos & UI Testing | 🚀 Production |

---

## ⚡ One-Line Toggle

**Just change ONE line** in `src/context/AuthContext.tsx`:

```typescript
const DEMO_MODE = true;   // For demos (current)
const DEMO_MODE = false;  // For production
```

That's it! The entire app adapts automatically.

---

## 🎯 When to Use Each Mode

### Use DEMO MODE when:
- 👥 Presenting to clients
- 🎨 Showcasing UI/UX
- 🧪 Testing frontend features  
- 📱 Demo on devices without backend
- 💡 Quick prototyping

### Use PRODUCTION MODE when:
- 🚀 Deploying to production
- 📊 Need real data persistence
- 👨‍💼 Multiple users
- 🔒 Need secure authentication
- 💾 Long-term data storage

---

## Current Status

**✅ You're in DEMO MODE** - Ready to present!

All features work without any backend setup.
