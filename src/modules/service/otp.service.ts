import prisma from "../../config/prisma";
export const getOtpByEmail = async (email: string) => {
    return prisma.otp.findUnique({
      where: { email },
    });
  };
  
  export const incrementOtpAttempts = async (email: string) => {
    return prisma.otp.update({
      where: { email },
      data: {
        attempts: { increment: 1 },
      },
    });
  };
  
  export const deleteOtp = async (email: string) => {
    return prisma.otp.delete({
      where: { email },
    });
  };