import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const addUserDetailsService = async (data: {
    userId: string;
    fullName: string;
    phoneNumber: string;
    image?: string;
    govtId?: string;
    cityIds?: number[];
  }) => {
    const { userId, fullName, phoneNumber, image, govtId, cityIds } = data;
  
    // 1. Validate user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }
  
    // 2. Validate cityIds
    if (!cityIds?.length || (user.type === 1 && cityIds.length > 1)) {
      throw new Error("Invalid city assignment based on user type");
    }
  
    // 3. Check if all cityIds exist
    const validCities = await prisma.city.findMany({
      where: { id: { in: cityIds } },
    });
    if (validCities.length !== cityIds.length) {
      throw new Error("One or more city IDs are invalid");
    }
  
    // 4. Create user details (ensure you set userId directly)
    const userDetails = await prisma.userDetails.create({
      data: {
        userId,        // ✅ required by schema
        fullName,
        phoneNumber,
        image,
        govtId,
      },
    });
  
    // 5. Map user to cities
    const userCityData = cityIds.map((cityId, index) => ({
      userDetailsId: userDetails.id,
      cityId,
      order: index,
    }));
  
    await prisma.userCity.createMany({ data: userCityData });
  
    return {
      message: "User details added successfully",
      userDetailsId: userDetails.id,
    };
  };