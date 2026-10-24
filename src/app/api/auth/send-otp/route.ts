import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/server/db/mongoose';
import OtpChallenge from '@/server/models/OtpChallenge';

const DEMO_OTP = '123456';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier } = body as { identifier?: string };

    if (!identifier) {
      return NextResponse.json({ error: 'Identifier is required' }, { status: 400 });
    }

    await connectDB();

    // Delete existing unused OTP for this identifier
    await OtpChallenge.deleteMany({ identifier, used: false });

    const otpHash = await bcrypt.hash(DEMO_OTP, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await OtpChallenge.create({
      identifier,
      otpHash,
      expiresAt,
      attempts: 0,
      used: false,
    });

    return NextResponse.json({
      success: true,
      demo: true,
      message: 'DEMO MODE — OTP is 123456 (shown for development only)',
    });
  } catch (err) {
    console.error('Send OTP error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
