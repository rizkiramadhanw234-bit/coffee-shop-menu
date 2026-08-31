import { appDataSource } from "../../config/db.js";
import { Admin } from "./admin.entity.js";
import { Token } from "./token.entity.js";
import { Session } from "./session.entity.js";
import { AppError, HTTP_STATUS } from "../../utils/error.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { StringValue } from "ms";

const adminRepo = appDataSource.getRepository(Admin);
const tokenRepo = appDataSource.getRepository(Token);
const sessionRepo = appDataSource.getRepository(Session);

export async function findAdminById(id: string) {
  const admin = await adminRepo.findOneBy({ id });
  if (!admin) {
    throw new AppError("Admin not found", HTTP_STATUS.NOT_FOUND);
  }

  const { password: _, ...noPassword } = admin;
  return { data: noPassword };
}

export async function loginAdmin(
  email: string,
  password: string,
  ipAdress: string,
  userAgent: string,
) {
  const admin = await adminRepo.findOne({
    where: { email },
  });

  if (!admin) {
    throw new AppError("Admin not found", HTTP_STATUS.NOT_FOUND);
  }

  const isValidPassword = await bcrypt.compare(password, admin.password);
  if (!isValidPassword) {
    throw new AppError("invalid credentials", HTTP_STATUS.BAD_REQUEST);
  }

  admin.lastLogin = new Date();
  await adminRepo.save(admin);

  const accessToken = jwt.sign(
    { adminId: admin.id },
    process.env.JWT_SECRET_KEY as StringValue,
    {
      expiresIn: process.env.JWT_EXPIRES_IN as StringValue,
    },
  );

  const tokenRandomString = crypto.randomUUID();
  const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const token = new Token();
  token.refreshToken = tokenRandomString;
  token.expiredAt = expiredAt;
  token.adminId = admin.id;
  await tokenRepo.save(token);

  const session = new Session();
  session.ipAdress = ipAdress;
  session.userAgent = userAgent;
  session.adminId = admin.id;
  session.tokenId = token.id;
  await sessionRepo.save(session);

  const { password: _, ...noPassword } = admin;

  return { accessToken, token, data: noPassword };
}

export async function refreshToken(refreshToken: string) {
  if (!refreshToken) {
    throw new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
  }

  const token = await tokenRepo.findOne({
    where: { refreshToken },
    relations: { admin: true },
  });

  if (!token) {
    throw new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
  }

  if (token.expiredAt < new Date()) {
    await tokenRepo.delete(token.id);
    throw new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
  }

  const admin = token.admin;
  if (!admin) {
    throw new AppError("admin not found", HTTP_STATUS.NOT_FOUND);
  }

  const accessToken = jwt.sign(
    { adminId: admin.id },
    process.env.JWT_SECRET_KEY as StringValue,
    { expiresIn: process.env.JWT_EXPIRES_IN as StringValue },
  );

  const tokenRandomString = crypto.randomUUID();
  const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  token.refreshToken = tokenRandomString;
  token.expiredAt = expiredAt;
  token.adminId = admin.id;
  await tokenRepo.save(token);

  const { password: _, ...data } = admin;

  return { accessToken, token, data };
}

export async function logoutAdmin(refreshToken: string) {
  const token = await tokenRepo.findOne({
    where: { refreshToken },
  });
  if (!token) {
    throw new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
  }

  await tokenRepo.delete(token.id);
  return;
}
