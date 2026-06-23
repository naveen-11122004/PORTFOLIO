import mongoose, { Schema, Document } from 'mongoose';
import crypto from 'crypto';

export interface IPasswordReset extends Document {
  email: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

const passwordResetSchema = new Schema<IPasswordReset>({
  email: { 
    type: String, 
    required: true,
    lowercase: true
  },
  token: { 
    type: String, 
    required: true,
    unique: true
  },
  expiresAt: { 
    type: Date, 
    required: true,
    index: { expireAfterSeconds: 0 } // Auto-delete after expiry
  },
  used: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Static method to generate reset token
passwordResetSchema.statics.generateResetToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  return {
    token,
    hashedToken: crypto.createHash('sha256').update(token).digest('hex')
  };
};

export const PasswordReset = mongoose.model<IPasswordReset>('PasswordReset', passwordResetSchema);
