import mongoose, { Schema, Document } from 'mongoose';

export interface IStoredFile extends Document {
  userId: string;
  fileName: string;
  contentType: string;
  data: Buffer;
  fileType: string; // 'resume', 'portfolio', 'cover-letter', 'other'
  description?: string;
  uploadedAt: Date;
}

const storedFileSchema = new Schema<IStoredFile>({
  userId: { type: String, required: true },
  fileName: { type: String, required: true },
  contentType: { type: String, required: true },
  data: { type: Buffer, required: true },
  fileType: { 
    type: String, 
    enum: ['resume', 'portfolio', 'cover-letter', 'other'],
    required: true 
  },
  description: { type: String },
  uploadedAt: { type: Date, default: Date.now },
});

export const StoredFile = mongoose.model<IStoredFile>('StoredFile', storedFileSchema);
