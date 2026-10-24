import mongoose, { Schema, Document } from 'mongoose';

export interface IOtpChallenge extends Document {
  identifier: string;
  otpHash: string;
  expiresAt: Date;
  attempts: number;
  used: boolean;
}

const OtpChallengeSchema = new Schema<IOtpChallenge>({
  identifier: { type: String, required: true },
  otpHash: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
  attempts: { type: Number, default: 0 },
  used: { type: Boolean, default: false },
});

const OtpChallenge =
  (mongoose.models.OtpChallenge as mongoose.Model<IOtpChallenge>) ||
  mongoose.model<IOtpChallenge>('OtpChallenge', OtpChallengeSchema);
export default OtpChallenge;
