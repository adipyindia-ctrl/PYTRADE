import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectDB } from './db/mongoose';
import User from './models/User';

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        identifier: { label: 'Mobile/Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;
        try {
          await connectDB();
          const user = await User.findOne({
            $or: [
              { email: credentials.identifier },
              { mobile: credentials.identifier },
            ],
          });
          if (!user) return null;
          const valid = await bcrypt.compare(credentials.password as string, user.passwordHash);
          if (!valid) return null;
          return {
            id: (user._id as object).toString(),
            name: user.name,
            email: user.email ?? '',
            mobile: user.mobile ?? '',
            kycStatus: user.kycStatus,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.kycStatus = (user as any).kycStatus as string | undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).id = token.id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).kycStatus = token.kycStatus;
      }
      return session;
    },
  },
});
