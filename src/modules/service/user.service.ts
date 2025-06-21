import prisma from '../../config/prisma';
import bcrypt from 'bcryptjs';
import { sendOtpEmail } from '../../config/mailer';
export const signupUserService = async (data: {
  name: string;
  email: string;
  password: string;
  type:number;
}) => {
  const { name, email, password,type } = data;
  const existingUser = await prisma.user.findUnique({ where: { email } });
  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  if (existingUser && existingUser.isVerified) {
    throw new Error('User already exists and is verified')
  }
  if (existingUser && !existingUser.isVerified) {
    await prisma.otp.update({
      where: {
        email
      },
      data: {
        otp,
        expiresAt
      },
    });
  }
  if (!existingUser) {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        type, 
      }
    });
    await prisma.otp.create({
      data: {
        email,
        otp,
        expiresAt,
      }
    });

  }
  await sendOtpEmail(email, otp);
};
export const verifyUserEmail = async (email: string) => {
  return prisma.user.update({
    where: { email },
    data: { isVerified: true },
  });
};

