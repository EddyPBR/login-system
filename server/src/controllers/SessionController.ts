import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
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

  async recoverPassword(request: Request, response: Response) {
    const { email } = request.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return response.status(404).json({
          error: "user not found",
        });
      }

      const token = crypto.randomBytes(20).toString("hex");

      const now = new Date();
      now.setHours(now.getHours() + 1);

      await User.findByIdAndUpdate(user._id, {
        $set: {
          passwordResetToken: token,
          passwordResetExpires: now,
        },
      });

      return response.status(200).json({
        success: "token has been generated for reset password",
      });
    } catch (error) {
      console.log(error);
      response.status(400).json({
        error: "cannot reset password, try again",
      });
    }
  }
}

export default SessionController;
