import { Request, Response } from "express";

class UserController {
  async index(request: Request, response: Response) {
    return response.status(200).json({
      message: "hello world",
    });
  }
}

export default UserController;
