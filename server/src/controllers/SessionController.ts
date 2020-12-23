import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import Mail from "@services/Mail";

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

      const subject = "Login System Api - Recover Password";

      const mail = new Mail(email, subject, token);

      try {
        await mail.sendMail();

        return response.status(200).json({
          success: "a email has sended",
        });
      } catch (error) {
        return response.status(400).json({
          error: "error to send a email",
        });
      }
    } catch (error) {
      response.status(400).json({
        error: "error on forgot password, try again",
      });
    }
  }
}

export default SessionController;
