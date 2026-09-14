import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../../config/db.config';
import { env } from '../../config/env.config';

interface OtpRecord {
  identifier: string;
  otpHash: string;
  expiresAt: number;
  attempts: number;
  requestedRole?: string;
}

// In-memory store for active OTPs and rate limits
const otpStore = new Map<string, OtpRecord>();
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export class OtpService {
  /**
   * Generates and dispatches a cryptographically secure 6-digit OTP.
   */
  async sendOtp(identifier: string, requestedRole?: string) {
    const cleanId = identifier.trim().toLowerCase();

    // 1. Rate Limiting Check (Max 3 OTP requests per 10 minutes)
    const now = Date.now();
    const rate = rateLimitStore.get(cleanId);
    if (rate) {
      if (now < rate.resetAt) {
        if (rate.count >= 3) {
          const waitMinutes = Math.ceil((rate.resetAt - now) / 60000);
          throw new Error(`Too many OTP requests. Please wait ${waitMinutes} minute(s) before trying again.`);
        }
        rate.count += 1;
      } else {
        rateLimitStore.set(cleanId, { count: 1, resetAt: now + 10 * 60 * 1000 });
      }
    } else {
      rateLimitStore.set(cleanId, { count: 1, resetAt: now + 10 * 60 * 1000 });
    }

    // 2. Generate 6-Digit Cryptographic OTP
    const rawOtp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = crypto.createHash('sha256').update(rawOtp).digest('hex');

    // 3. Store OTP record (5-minute TTL)
    const expiresAt = now + 5 * 60 * 1000;
    otpStore.set(cleanId, {
      identifier: cleanId,
      otpHash,
      expiresAt,
      attempts: 0,
      requestedRole: requestedRole || 'CITIZEN',
    });

    console.log(`[OTP Engine] Generated OTP for ${cleanId}: ${rawOtp} (Expires in 5m)`);

    return {
      success: true,
      message: `OTP sent successfully to ${cleanId}. Valid for 5 minutes.`,
      otpPreview: rawOtp,
      expiresInSeconds: 300,
    };
  }

  /**
   * Verifies the 6-digit OTP and generates a JWT session.
   */
  async verifyOtp(identifier: string, otp: string) {
    const cleanId = identifier.trim().toLowerCase();
    const record = otpStore.get(cleanId);

    if (!record) {
      throw new Error('No OTP request found for this identifier. Please request a new OTP.');
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(cleanId);
      throw new Error('OTP has expired. Please request a fresh OTP.');
    }

    if (record.attempts >= 3) {
      otpStore.delete(cleanId);
      throw new Error('Maximum incorrect attempts exceeded. Please request a new OTP.');
    }

    const inputHash = crypto.createHash('sha256').update(otp.trim()).digest('hex');
    if (inputHash !== record.otpHash) {
      record.attempts += 1;
      const remaining = 3 - record.attempts;
      throw new Error(`Invalid OTP. ${remaining} attempt(s) remaining.`);
    }

    // OTP is valid — clear record
    otpStore.delete(cleanId);

    // Find or Auto-provision user
    const isEmail = cleanId.includes('@');
    const searchCondition = isEmail ? { email: cleanId } : { phone: cleanId };

    let user = await prisma.user.findFirst({
      where: searchCondition,
    });

    let isNewUser = false;
    if (!user) {
      // Auto-register new Citizen via verified OTP
      isNewUser = true;
      const defaultEmail = isEmail ? cleanId : `${cleanId}@citizen.samadhan.gov.in`;
      const defaultPhone = isEmail ? undefined : cleanId;
      const placeholderPass = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10);

      user = await prisma.user.create({
        data: {
          email: defaultEmail,
          phone: defaultPhone,
          name: isEmail ? cleanId.split('@')[0] : `Citizen ${cleanId.slice(-4)}`,
          role: (record.requestedRole as any) || 'CITIZEN',
          passwordHash: placeholderPass,
          isVerified: true,
        },
      });
    }

    // Generate JWT Access Token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN } as any
    );

    const { passwordHash: _, ...safeUser } = user;
    return {
      user: safeUser,
      token,
      isNewUser,
    };
  }
}

export const otpService = new OtpService();
