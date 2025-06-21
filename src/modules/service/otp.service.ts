import prisma from "../../config/prisma";
export const getOtpByEmail = async (userId: string) => {
    return prisma.otp.findUnique({
      where: { userId },
    });
  };
  
  export const incrementOtpAttempts = async (userId: string) => {
    return prisma.otp.update({
      where: { userId },
      data: {
        attempts: { increment: 1 },
      },
    });
  };
  
  export const deleteOtp = async (userId: string) => {
    return prisma.otp.delete({
      where: { userId },
    });
  };