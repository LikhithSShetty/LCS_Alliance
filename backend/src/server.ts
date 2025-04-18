import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose'; // Import mongoose
import authRoutes from './routes/authRoutes'; // Import auth routes

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Database connection function
const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.error('Error: MONGODB_URI is not defined in .env file');
    process.exit(1); // Exit process with failure
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected...');
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('MongoDB Connection Error:', errorMessage);
    process.exit(1); // Exit process with failure
  }
};

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json()); // To parse JSON request bodies

// API Routes
app.use('/api/auth', authRoutes); // Use auth routes

// Basic Route
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the LCS Alliance Backend API!' });
});

// Mongoose connection event listeners (optional but good practice)
mongoose.connection.on('error', (err) => {
  console.error(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`CORS enabled for: ${FRONTEND_URL}`);
}); 