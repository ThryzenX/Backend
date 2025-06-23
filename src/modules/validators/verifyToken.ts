import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    type: number;
  };
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const frontendToken = authHeader.split(" ")[1];

  try {
    const decoded = jwt.decode(frontendToken) as JwtPayload | null;

    if (!decoded || typeof decoded !== "object" || !decoded.userId) {
      return res.status(401).json({ message: "Invalid token structure" });
    }

    const userId = decoded.userId;
    const tokenRecord = await prisma.token.findFirst({
      where: { userId },
    });

    if (!tokenRecord || tokenRecord.token !== frontendToken) {
      return res.status(401).json({ message: "Token mismatch or not found in DB" });
    }
    try {
      const verifiedPayload = jwt.verify(frontendToken, process.env.JWT_SECRET!) as {
        userId: string;
        email: string;
        type: number;
        exp: number;
        iat: number;
      };
      req.user = {
        userId: verifiedPayload.userId,
        email: verifiedPayload.email,
        type: verifiedPayload.type,
      };

      return next();

    } catch (verifyError) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

  } catch (err) {
    console.error("Token verification middleware error:", err);
    return res.status(500).json({ message: "Server error during token check" });
  }
};
