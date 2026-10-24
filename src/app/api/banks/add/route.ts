import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/auth';
import { connectDB } from '@/server/db/mongoose';
import User from '@/server/models/User';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json() as {
    bankName?: string;
    accountNumber?: string;
    ifsc?: string;
    holderName?: string;
  };
  const masked = 'XXXXXXXX' + String(body.accountNumber ?? '').slice(-4);
  await connectDB();
  const user = await User.findByIdAndUpdate(
    session.user.id,
    {
      $push: {
        linkedBanks: {
          bankName: body.bankName,
          maskedAccount: masked,
          ifsc: body.ifsc,
          holderName: body.holderName,
          isPrimary: false,
        },
      },
    },
    { new: true }
  );
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json({ success: true, linkedBanks: user.linkedBanks });
}
