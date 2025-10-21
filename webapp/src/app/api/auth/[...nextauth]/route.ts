import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Facebook from 'next-auth/providers/facebook';
import Apple from 'next-auth/providers/apple';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { PrismaClient } from '@/generated/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' as const },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        // Use a fresh PrismaClient with an explicit URL to avoid inherited env overrides
        const explicitUrl = process.env.DATABASE_URL || 'postgresql://realestate:realestate@localhost:5432/realestate?schema=public';
        if (process.env.NODE_ENV !== 'production') {
          console.log('[auth] credentials authorize using', explicitUrl, ' PRISMA_DATASOURCE_URL=', process.env.PRISMA_DATASOURCE_URL);
        }
        const localPrisma = new PrismaClient({ datasources: { db: { url: explicitUrl } } });
        const user = await localPrisma.user.findUnique({ where: { email } }).finally(() => localPrisma.$disconnect());
        if (!user || !user.passwordHash) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, email: user.email ?? undefined, name: user.name ?? undefined } as any;
      },
    }),
    Google({ clientId: process.env.GOOGLE_CLIENT_ID || '', clientSecret: process.env.GOOGLE_CLIENT_SECRET || '' }),
    Facebook({ clientId: process.env.FACEBOOK_CLIENT_ID || '', clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '' }),
    Apple({ clientId: process.env.APPLE_CLIENT_ID || '', clientSecret: process.env.APPLE_CLIENT_SECRET || '' }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (token?.sub && session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(authOptions as any);
export { handler as GET, handler as POST };


