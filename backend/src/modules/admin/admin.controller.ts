import type { Request, Response } from "express";
import * as adminService from "./admin.service.js";
import { AppError } from "../../utils/error.js";

export async function findAdminById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const { data } = await adminService.findAdminById(id);
    res.status(200).json({ message: "find admin by id", data });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}

export async function loginAdmin(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const { accessToken, token, data } = await adminService.loginAdmin(
      email,
      password,
      req.ip as string,
      req.headers["user-agent"] as string,
    );

    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ message: "admin logged in", accessToken, data });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}

export async function refreshToken(req: Request, res: Response): Promise<void> {
  try {
    const refreshToken = req.cookies.refreshToken as string;
    const { accessToken, token, data } =
      await adminService.refreshToken(refreshToken);

    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ message: "new refresh token", accessToken, data });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}

export async function logoutAdmin(req: Request, res: Response): Promise<void> {
  try {
    const refreshToken = req.cookies.refreshToken as string;
    await adminService.logoutAdmin(refreshToken);

    res.clearCookie("refreshToken");
    res.status(200).json({ message: "admin logged out" });
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}
