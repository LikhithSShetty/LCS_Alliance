import mongoose, { Schema, Document } from 'mongoose';

// Interface for the Enrollment document
export interface IEnrollment extends Document {
  userId: mongoose.Types.ObjectId; // Reference to the User
  classId: mongoose.Types.ObjectId; // Reference to the Class
  status: 'pending' | 'approved' | 'rejected';
  enrollDate: Date; // Provided by timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Define the Enrollment schema
const EnrollmentSchema: Schema<IEnrollment> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Link to the User model
      required: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class', // Link to the Class model
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt (which acts as enrollDate) and updatedAt
  }
);

// Ensure a user can only enroll in a specific class once
EnrollmentSchema.index({ userId: 1, classId: 1 }, { unique: true });

// Export the Enrollment model
const Enrollment = mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);

export default Enrollment; 