import mongoose, { Schema, Document } from 'mongoose';

// Interface for the Class document
export interface IClass extends Document {
  name: string;
  subject: string;
  description: string;
  date: string; // Store as string YYYY-MM-DD for simplicity, align with frontend
  time: string; // Store as string HH:MM AM/PM for simplicity, align with frontend
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Class schema
const ClassSchema: Schema<IClass> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Class name is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '', // Provide a default value
    },
    date: {
      type: String,
      required: [true, 'Class date is required'],
      // Potential validation: match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format']
    },
    time: {
      type: String,
      required: [true, 'Class time is required'],
      // Potential validation: match: [/^\d{1,2}:\d{2}\s(AM|PM)$/i, 'Time must be in HH:MM AM/PM format']
    },
    imageUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Export the Class model
const Class = mongoose.model<IClass>('Class', ClassSchema);

export default Class; 