import { createUser } from "../service/user.service";
import { Request, Response } from 'express';
export const handleCreateUser = async (req: Request, res: Response) : Promise<any> => {
    const { name, email, mobileNumber } = req.body;
  
    if (!name || !email || !mobileNumber) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    try {
      const user = await createUser({ name, email, mobileNumber });
      res.status(201).json(user);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Email already exists' });
      }
      res.status(500).json({ error: 'Something went wrong' });
    }
  };