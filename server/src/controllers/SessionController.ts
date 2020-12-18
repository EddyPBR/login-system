import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "@models/User";

class SessionController {
  async authenticate(request: Request, response: Response) {
    const { email, password } = request.body;

    const user = await User.findOne({ email });

    if (!user) {
      return response.status(404).json({
        error: "user not found",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return response.status(401).json({
        error: "invalid password",
      });
    }

    const secret = process.env.JWT_SECRET as string;

    const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1d" });

    return response.status(200).json({
      _id: user._id,
      email: user.email,
      token,
    });
  }

  async check(request: Request, response: Response) {
    return response.status(200).json({
      message: "user is authenticated",
    });
  }
}

export default SessionController;
