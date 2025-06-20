import { loginService } from "../service/login.service";
import { Request, Response } from 'express';
export const loginController = async (req: Request, res: Response):Promise<any> => {
  try {
    const { email, password } = req.body;
    const result = await loginService(email, password);

    return res.status(result.status).json(
      result.status === 200
        ? { token: result.token }
        : { message: result.message }
    );
  } catch (err) {
    return res.status(400).json({ error: "Invalid input" });
  }
};
