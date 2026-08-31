import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { JwtPayload } from "jsonwebtoken";

const COOKIE_NAME = "guestId";
const COOKIE_MAX_AGE = 12 * 60 * 60 * 1000;

declare global {
  namespace Express {
    interface Request {
      guestId: string | JwtPayload;
    }
  }
}

export function guestSession(req: Request, res: Response, next: NextFunction) {
  let guestId = req.cookies?.[COOKIE_NAME];

  if (!guestId) {
    guestId = crypto.randomUUID();
    res.cookie(COOKIE_NAME, guestId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      secure: process.env.NODE_ENV === "production",
    });
  }

  req.guestId = guestId;
  next();
}
