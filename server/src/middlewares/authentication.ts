import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface Itoken {
  _id: string;
  iat: number;
  exp: number;
}

export default function authenticate(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { authorization } = request.headers;

  if (!authorization) {
    return response.status(401).json({
      error: "not authorized",
    });
  }

  const token = authorization.replace("Bearer", "").trim();

  try {
    const secret = process.env.JWT_SECRET;
    const data = jwt.verify(token, secret);

    const { _id } = data as Itoken;

    request.userID = _id;

    return next();
  } catch (error) {
    return response.status(401).json({
      error: "not authorized",
    });
  }
}
