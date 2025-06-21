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
  if (existingUser && existingUser.isVerified) {
    throw new Error('User already exists and is verified')
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  if (existingUser && !existingUser.isVerified) {
    await prisma.otp.update({
      where: {
        userId:existingUser.id
      },
      data: {
        otp,
        expiresAt
      },
    });
    await sendOtpEmail(email, otp);
    return existingUser.id;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  if (!existingUser) {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        type, 
      }
    });
    await prisma.otp.create({
      data: {
        userId:newUser.id,
        otp,
        expiresAt,
      }
    });
    await sendOtpEmail(email, otp);
    return newUser.id;
  }
  
};
export const verifyUserEmail = async (userId: string) => {
  return prisma.user.update({
    where: { id:userId },
    data: { isVerified: true },
  });
};

