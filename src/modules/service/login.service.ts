import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const loginService = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { status: 401, message: "Invalid c . redentials" };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return { status: 401, message: "Invalid credentials" };
  }
  const token = jwt.sign(
    { userId: user.id, email: user.email, type: user.type }, 
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );
  await prisma.token.create({
    data: {
      token,
      userId: user.id,
    },
  });
  return { status: 200, token };
};
