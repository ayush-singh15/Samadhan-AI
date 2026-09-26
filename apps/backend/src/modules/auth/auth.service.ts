import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../../config/db.config';
import { env } from '../../config/env.config';

export class AuthService {
  async register(data: { email: string; name: string; role: string; password: string }) {
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new Error('Email already registered');

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: data.role as any,
        passwordHash,
        isVerified: true,
      },
      select: { id: true, email: true, name: true, role: true, isVerified: true, createdAt: true },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN } as any
    );

    return { user, token };
  }

  async login(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new Error('Invalid email or password');

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) throw new Error('Invalid email or password');

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN } as any
    );

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, token };
  }

  /**
   * Phone-First One-Click Authentication & Personalization
   * Instantly authenticates citizen via 10-digit phone number,
   * persists their real name in PostgreSQL, and generates JWT session.
   */
  async phoneLogin(data: { phone: string; name?: string; role?: string }) {
    const digits = data.phone.replace(/\D/g, '');
    const phone10 = digits.slice(-10);

    if (phone10.length !== 10) {
      throw new Error('Please enter a valid 10-digit Indian mobile number.');
    }

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: phone10 },
          { phone: `+91${phone10}` },
          { email: `${phone10}@citizen.samadhan.gov.in` },
        ],
      },
    });

    let isNewUser = false;
    const preferredName = data.name?.trim();

    if (!user) {
      isNewUser = true;
      const defaultEmail = `${phone10}@citizen.samadhan.gov.in`;
      const resolvedName = preferredName || `Citizen ${phone10.slice(-4)}`;
      const placeholderPass = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10);

      user = await prisma.user.create({
        data: {
          email: defaultEmail,
          phone: phone10,
          name: resolvedName,
          role: (data.role as any) || 'CITIZEN',
          passwordHash: placeholderPass,
          isVerified: true,
        },
      });
    } else if (preferredName && (user.name !== preferredName || user.name.startsWith('Citizen '))) {
      // Update name to citizen's chosen personalized real name
      user = await prisma.user.update({
        where: { id: user.id },
        data: { name: preferredName, phone: phone10 },
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN } as any
    );

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, token, isNewUser };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, phone: true, avatarUrl: true, isVerified: true, createdAt: true },
    });
    if (!user) throw new Error('User not found');
    return user;
  }
}

export const authService = new AuthService();
