import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables (especially JWT_SECRET)
dotenv.config({ path: require.resolve('../../.env') }); // Adjust path if needed

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("Fatal Error: JWT_SECRET is not defined.");
  process.exit(1);
}

// Registration Controller
export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide username, email, and password' });
  }

  // Validate role if provided
  if (role && !['student', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified' });
  }

  try {
    // 1. Check if user already exists (by email or username)
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email or username' });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10); // Generate salt (cost factor 10)
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create a new User document
    // Use validated role or default to 'student' from the schema
    user = new User({
      username,
      email,
      password: hashedPassword,
      role: role, // Schema default will apply if role is undefined
    });

    // 4. Save the user to the database
    await user.save();

    // 5. Generate a JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    // Sign the token (expires in 1 hour for this example)
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' }, // Token expiration time
      (err, token) => {
        if (err) throw err;
        // 6. Send token AND user info back
        res.status(201).json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          }
        });
      }
    );

  } catch (err) {
    console.error('Registration Error:', err);
    // Handle potential duplicate key errors from MongoDB if findOne check somehow fails
    if (err instanceof Error && 'code' in err && err.code === 11000) {
      return res.status(400).json({ message: 'User already exists (duplicate key)' });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login Controller
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    // 1. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' }); // Use generic message
    }

    // 2. Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' }); // Use generic message
    }

    // 3. Generate a JWT token (User is authenticated)
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    // Sign the token (expires in 1 hour for this example)
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' }, // Token expiration time
      (err, token) => {
        if (err) throw err;
        // 4. Send token AND user info back
        res.status(200).json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          }
        });
      }
    );

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
}; 