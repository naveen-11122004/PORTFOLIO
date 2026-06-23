import mongoose, { Schema, Document } from 'mongoose';

export interface ICertification extends Document {
  userId: string;
  title: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
  certificateFile?: {
    fileName: string;
    contentType: string;
    data: Buffer;
  };
  uploadedAt: Date;
}

const certificationSchema = new Schema<ICertification>({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  issueDate: { type: Date, required: true },
  expiryDate: { type: Date },
  credentialId: { type: String },
  credentialUrl: { type: String },
  certificateFile: {
    fileName: { type: String },
    contentType: { type: String },
    data: { type: Buffer },
  },
  uploadedAt: { type: Date, default: Date.now },
});

export const Certification = mongoose.model<ICertification>('Certification', certificationSchema);
