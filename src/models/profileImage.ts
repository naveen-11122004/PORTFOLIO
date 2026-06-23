import mongoose, { Schema, Document } from 'mongoose';

export interface IProfileImage extends Document {
  userId: string;
  fileName: string;
  contentType: string;
  data: Buffer;
  uploadedAt: Date;
}

const profileImageSchema = new Schema<IProfileImage>({
  userId: { type: String, required: true, unique: true },
  fileName: { type: String, required: true },
  contentType: { type: String, required: true },
  data: { type: Buffer, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export const ProfileImage = mongoose.model<IProfileImage>('ProfileImage', profileImageSchema);
