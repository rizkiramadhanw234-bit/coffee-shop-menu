import type { Request, Response, NextFunction } from "express";
import { appDataSource } from "../config/db.js";
import { Admin } from "../modules/admin/admin.entity.js";

const adminRepo = appDataSource.getRepository(Admin);

export async function isAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { adminId } = req.user as { adminId: string };
    if (!adminId) {
      res.status(401).json({ message: "access denied" });
    }

    const admin = await adminRepo.findOneBy({ id: adminId });
    if (!admin) {
      res.status(404).json({ message: "admin not found" });
    }

    const allowedRoles = ["super_admin", "staff"];
    if (!allowedRoles.includes(admin.adminRole)) {
      res.status(401).json({ message: "access denied" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
}
