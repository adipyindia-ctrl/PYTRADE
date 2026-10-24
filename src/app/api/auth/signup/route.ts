import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/server/db/mongoose';
import User from '@/server/models/User';

function validatePassword(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one digit';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character';
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, identifier, type, password } = body as {
      name?: string;
      identifier?: string;
      type?: string;
      password?: string;
    };

    if (!name || !identifier || !password) {
      return NextResponse.json({ error: 'Name, identifier, and password are required' }, { status: 400 });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    await connectDB();

    // Check duplicate
    const emailOrMobile = type === 'email' ? { email: identifier } : { mobile: identifier };
    const existing = await User.findOne(emailOrMobile);
    if (existing) {
      return NextResponse.json(
        { error: type === 'email' ? 'Email already registered' : 'Mobile number already registered' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await User.create({
      name: name.trim(),
      ...(type === 'email' ? { email: identifier } : { mobile: identifier }),
      passwordHash,
      kycStatus: 'NOT_STARTED',
    });

    return NextResponse.json({ success: true, message: 'Account created' }, { status: 201 });
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
