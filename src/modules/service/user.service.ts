import prisma from "../../config/prisma";

export const createUser = async (data: {
  name: string;
  email: string;
  mobileNumber: string;
}) => {
  return prisma.user.create({ data });
};