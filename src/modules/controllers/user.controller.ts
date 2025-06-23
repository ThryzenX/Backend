import { Request, Response } from 'express';
import { signupUserService } from '../service/user.service';
import { getOtpByEmail,incrementOtpAttempts,deleteOtp } from '../service/otp.service';
import { verifyUserEmail } from '../service/user.service';
import { addUserDetailsService } from '../service/userDetail.service';
import { verifyToken } from '../validators/verifyToken';
import { AuthRequest } from '../validators/verifyToken';
export const signupUserController = async (req: Request, res: Response) => {
  const userInput = req.body;
  try {
  const result = await signupUserService(userInput);
  res.status(201).json(result);
} catch (err: any) {
  res.status(err.statusCode || 500).json({ message: err.message });
}
};
export const verifyOtpController = async (req: Request, res: Response): Promise<any> => {
  try {
    const parsed = req.body;
    // if (!parsed.success) {
    //   return res.status(400).json({ error: 'Invalid input' });
    // }

    const { userId, otp } = parsed;
    const otpRecord = await getOtpByEmail(userId);

    if (!otpRecord) {
      return res.status(404).json({ error: 'OTP not found or already verified' });
    }

    if (otpRecord.otp !== otp) {
      await incrementOtpAttempts(userId);
      return res.status(401).json({ error: 'Incorrect OTP' });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(410).json({ error: 'OTP expired' });
    }

    await verifyUserEmail(userId);
    await deleteOtp(userId);

    return res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
export const addUserDetailsController = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const parsed = req.body;

    const result = await addUserDetailsService({
      userId,
      ...parsed,
    });

    res.status(200).json({
      message: "User details added successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};
