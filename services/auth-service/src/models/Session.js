import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true
    },
    userAgent: {
      type: String
    },
    ipAddress: {
      type: String
    },
    isValid: {
      type: Boolean,
      default: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 } // TTL index
    }
  },
  { timestamps: true }
);

export default mongoose.model('Session', sessionSchema);
