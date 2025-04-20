# How It's Built: LCS Alliance University Lecture Vault

This document provides a detailed technical breakdown of how the project is architected and how each feature is implemented, referencing the Product Resource Document.

---

## 1. Authentication & Authorization
- **User Registration & Login:**
  - Implemented in `backend/src/controllers/authController.ts`.
  - Passwords are hashed with bcrypt before storing in MongoDB.
  - JWT tokens are issued on successful login/registration and include user id and role (student/admin).
  - Frontend stores JWT in context (`src/context/AuthContext.tsx`) and sends it in the `Authorization` header for protected actions.
- **Role-Based Access:**
  - User roles are checked both in backend (for protected API routes) and frontend (for UI rendering and access control).

## 2. Class & Enrollment Management
- **Class Data:**
  - Defined in `backend/src/models/Class.ts` (MongoDB schema) and as mock data in `src/context/ClassContext.tsx` for demo/testing.
  - Each class includes: id, name, subject, description, date, time, imageUrl.
- **Enrollment:**
  - Managed in `backend/src/models/Enrollment.ts` and in frontend context for demo.
  - Students enroll in classes via the UI (`src/pages/Classes.tsx`).
  - Enrollment status (`pending`, `approved`, `rejected`) is tracked; only approved students can access class videos.

## 3. Video Management & Display
- **Video Data:**
  - Videos are uploaded to YouTube as unlisted and their metadata (YouTube ID, classId, title, subject, description, date, time, duration) is stored in `backend/src/models/Video.ts` and/or `src/context/ClassContext.tsx`.
  - Admins can add videos to classes via the UI (calls context methods, updates state/localStorage).
- **Embedding:**
  - `src/components/Video/VideoPlayer.tsx` receives a YouTube video ID and renders it using an `<iframe src="https://www.youtube.com/embed/{videoId}">`.
  - Only students enrolled in a class (or admins) can see its videos.

## 4. Access Control
- **Frontend:**
  - Uses React Context (`AuthContext.tsx` and `ClassContext.tsx`) to check user role and enrollment before rendering protected content or actions.
- **Backend:**
  - Middleware (not shown in demo) would check JWT and user role for protected API endpoints in production.

## 5. UI & User Experience
- **Landing Page:** `src/pages/Index.tsx` with hero image, feature summary, and navigation.
- **Class Listing:** `src/pages/Classes.tsx` lists all classes, allows enrollment, and shows enrollment status.
- **Class Details:** `src/pages/ClassPage.tsx` shows class info and embedded videos (if enrolled/admin).
- **Dashboard:** `src/pages/Dashboard.tsx` shows enrolled classes for students and management options for admins.
- **Reusable Components:** UI built with shadcn/ui and Tailwind CSS for a modern, responsive look.

## 6. Data Flow Example
1. User registers/logs in → receives JWT and role.
2. User sees list of classes and can enroll.
3. If enrolled (or admin), user can view class page and see embedded YouTube videos.
4. Admins can create classes and add videos (UI, context methods).

## 7. Security & Best Practices
- Passwords are never stored in plain text (bcrypt hashing).
- JWT is used for stateless authentication.
- CORS is configured to allow only the frontend origin.
- Unlisted YouTube videos + authentication for access control.
- All sensitive actions (class/video creation, enrollment approval) are protected by role checks.

## 8. Technologies Used
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express.js, Mongoose (MongoDB)
- **Authentication:** JWT, bcrypt
- **Video:** YouTube Embed API

---

