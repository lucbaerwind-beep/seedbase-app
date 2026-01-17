import { cookies } from "next/headers";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

const SESSION_COOKIE = "sb_session";
const SESSION_TTL_DAYS = 7;

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set");
  }
  return secret;
}

function signPayload(payload: string) {
  const hmac = crypto.createHmac("sha256", getSessionSecret());
  hmac.update(payload);
  return hmac.digest("hex");
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function createSession(userId: string) {
  const timestamp = Date.now();
  const payload = `${userId}.${timestamp}`;
  const signature = signPayload(payload);
  const token = `${payload}.${signature}`;
  const expires = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires
  });
}

export function clearSession() {
  cookies().set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0)
  });
}

export async function getSessionUser() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }
  const [userId, timestamp, signature] = token.split(".");
  if (!userId || !timestamp || !signature) {
    return null;
  }
  const payload = `${userId}.${timestamp}`;
  if (signPayload(payload) !== signature) {
    return null;
  }
  const ageMs = Date.now() - Number(timestamp);
  if (Number.isNaN(ageMs) || ageMs > SESSION_TTL_DAYS * 24 * 60 * 60 * 1000) {
    return null;
  }
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true }
  });
}

export async function requireSessionUser() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireRole(role: "ADMIN" | "SUPPLIER") {
  const user = await requireSessionUser();
  if (user.role !== role) {
    throw new Error("Forbidden");
  }
  return user;
}
