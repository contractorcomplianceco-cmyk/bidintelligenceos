import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";

const JWT_SECRET = process.env.SESSION_SECRET ?? process.env.JWT_SECRET ?? "bios-dev-secret-change-in-production";
const COOKIE_NAME = "bios_token";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export type AuthPayload = {
  userId: string;
  orgId: string;
  email: string;
  role: string;
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

export function setAuthCookie(res: Response, payload: AuthPayload) {
  const token = signToken(payload);
  const isProd = process.env.NODE_ENV === "production";
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: MAX_AGE_MS,
    path: "/",
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

export function readAuthFromRequest(req: Request): AuthPayload | null {
  const token = req.cookies?.[COOKIE_NAME] ?? bearerToken(req);
  if (!token) return null;
  return verifyToken(token);
}

function bearerToken(req: Request): string | undefined {
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer ")) return undefined;
  return h.slice(7);
}
