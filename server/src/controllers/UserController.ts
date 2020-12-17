import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import User from "@models/User";

class UserController {
  async index(request: Request, response: Response) {
    return response.status(200).json({
      message: "hello world",
    });
  }

  async create(request: Request, response: Response) {
    const { email, password } = request.body;

    try {
      const newUser = await User.create({
        email,
        password,
      });

      return response.status(201).json(newUser);
    } catch (error) {
      if (error.code === 11000) {
        return response.status(409).json({
          error: "user already registered",
        });
      }

      return response.status(500).json({
        error: "internal server error",
      });
    }
  }

  async update(request: Request, response: Response) {
    const { _id } = request.params;
    const { email, password } = request.body;

    const updateUser = await User.findOneAndUpdate(
      { _id },
      {
        email: email,
        password: bcrypt.hashSync(password, 8),
      }
    );

    return updateUser
      ? response.status(201).json(updateUser)
      : response.status(500).json({
          error: "internal server error",
        });
  }
}

export default UserController;
