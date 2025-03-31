import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface ITrainer extends Document {
  userId: IUser['_id'];
  skills: string[];
  experience: number;
  documents: {
    type: string;
    url: string;
  }[];
  availability: {
    day: string;
    slots: string[];
  }[];
  rating: number;
  status: 'available' | 'busy' | 'offline';
  bio: string;
  hourlyRate: number;
  totalSessions: number;
  completedSessions: number;
  createdAt: Date;
  updatedAt: Date;
}

const trainerSchema = new Schema<ITrainer>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skills: [{
    type: String,
    required: true
  }],
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  documents: [{
    type: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  availability: [{
    day: {
      type: String,
      required: true,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    slots: [{
      type: String,
      required: true
    }]
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  status: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'offline'
  },
  bio: {
    type: String,
    required: true,
    maxlength: 500
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  completedSessions: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for searching trainers by skills
trainerSchema.index({ skills: 1 });

// Index for searching trainers by availability
trainerSchema.index({ 'availability.day': 1, 'availability.slots': 1 });

export const Trainer = mongoose.model<ITrainer>('Trainer', trainerSchema); 