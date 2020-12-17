import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import User from "@models/User";

class UserController {
  async index(request: Request, response: Response) {
    try {
      const users = await User.find();

      return response.status(200).json(users);
    } catch (error) {
      return response.status(500).json({
        error: "internal server error",
      });
    }
  }

  async search(request: Request, response: Response) {
    const { _id } = request.params;

    try {
      const user = await User.findOne({ _id });

      return user
        ? response.status(200).json(user)
        : response.status(404).json({
            error: "user not found",
          });
    } catch (error) {
      return response.status(500).json({
        error: "internal server error",
      });
    }
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

    try {
      const updateUser = await User.findOneAndUpdate(
        { _id },
        {
          email: email,
          password: bcrypt.hashSync(password, 8),
        }
      );

      return updateUser
        ? response.status(200).json(updateUser)
        : response.status(404).json({
            error: "user not found",
          });
    } catch (error) {
      response.status(500).json({
        error: "internal server error",
      });
    }
  }

  async delete(request: Request, response: Response) {
    const { _id } = request.params;

    try {
      const deletedUser = await User.findByIdAndDelete({ _id });

      return deletedUser
        ? response.status(200).json(deletedUser)
        : response.status(404).json({
            error: "user not found",
          });
    } catch (error) {
      response.status(500).json({
        error: "internal server error",
      });
    }
  }
}

export default UserController;
