import { Request, Response } from 'express';
import { signupUserService } from '../service/user.service';
import { getOtpByEmail,incrementOtpAttempts,deleteOtp } from '../service/otp.service';
import { verifyUserEmail } from '../service/user.service';
export const signupUserController = async (req: Request, res: Response) : Promise<any>  => {
  const userInput = req.body;
  try {
  const result = await signupUserService(userInput);
  res.status(201).json(result);
} catch (err: any) {
  res.status(err.statusCode || 500).json({ message: err.message });
}
};
export const verifyOtpController = async (req: Request, res: Response) => {
  try {
    const parsed = req.body;
    // if (!parsed.success) {
    //   return res.status(400).json({ error: 'Invalid input' });
    // }

    const { email, otp } = parsed;
    const otpRecord = await getOtpByEmail(email);

    if (!otpRecord) {
      return res.status(404).json({ error: 'OTP not found or already verified' });
    }

    if (otpRecord.otp !== otp) {
      await incrementOtpAttempts(email);
      return res.status(401).json({ error: 'Incorrect OTP' });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(410).json({ error: 'OTP expired' });
    }

    await verifyUserEmail(email);
    await deleteOtp(email);

    return res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
