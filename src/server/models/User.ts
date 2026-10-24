import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email?: string;
  mobile?: string;
  passwordHash: string;
  kycStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'DEMO_VERIFIED';
  kycData: {
    pan?: string;
    panVerified?: boolean;
    personalDetails?: Record<string, string>;
    bankAccount?: {
      bankName: string;
      maskedAccount: string;
      ifsc: string;
      verified: boolean;
    };
  };
  linkedBanks: Array<{
    bankName: string;
    maskedAccount: string;
    ifsc: string;
    holderName: string;
    isPrimary: boolean;
  }>;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, sparse: true, lowercase: true, trim: true },
  mobile: { type: String, sparse: true, trim: true },
  passwordHash: { type: String, required: true },
  kycStatus: {
    type: String,
    enum: ['NOT_STARTED', 'IN_PROGRESS', 'SUBMITTED', 'DEMO_VERIFIED'],
    default: 'NOT_STARTED',
  },
  kycData: { type: Schema.Types.Mixed, default: {} },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  linkedBanks: { type: Schema.Types.Mixed as any, default: [] },
  createdAt: { type: Date, default: Date.now },
});

const User = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
export default User;
