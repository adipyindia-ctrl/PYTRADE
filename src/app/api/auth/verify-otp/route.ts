import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/server/db/mongoose';
import OtpChallenge from '@/server/models/OtpChallenge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, otp } = body as { identifier?: string; otp?: string };

    if (!identifier || !otp) {
      return NextResponse.json({ error: 'Identifier and OTP are required' }, { status: 400 });
    }

    await connectDB();

    const challenge = await OtpChallenge.findOne({
      identifier,
      used: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!challenge) {
      return NextResponse.json({ error: 'OTP expired or not found' }, { status: 400 });
    }

    if (challenge.attempts >= 3) {
      return NextResponse.json({ error: 'Too many attempts. Request a new OTP.' }, { status: 429 });
    }

    challenge.attempts += 1;
    await challenge.save();

    const isValid = await bcrypt.compare(otp, challenge.otpHash);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    challenge.used = true;
    await challenge.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Verify OTP error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
