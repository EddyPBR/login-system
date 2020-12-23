import express from "express";
import { celebrate, Joi } from "celebrate";

import checkAuthentication from "@middlewares/authentication";

import UserController from "@controllers/UserController";
import SessionController from "@controllers/SessionController";

const userController = new UserController();
const sessionController = new SessionController();

const routes = express.Router();

routes.get("/users", userController.index);
routes.get(
  "/users/:_id",
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().required().not("null").not("undefined"),
    }),
  }),
  userController.search
);
routes.post(
  "/users",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }),
  }),
  userController.create
);
routes.put(
  "/users/:_id",
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().required().not("null").not("undefined"),
    }),
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }),
  }),
  userController.update
);
routes.delete(
  "/users/:_id",
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().required().not("null").not("undefined"),
    }),
  }),
  userController.delete
);

routes.get("/sessions", checkAuthentication, sessionController.check);

routes.post(
  "/sessions",
  celebrate(
    {
      body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  sessionController.authenticate
);

routes.put(
  "/sessions/recover-password",
  celebrate(
    {
      body: Joi.object().keys({
        email: Joi.string().email().required(),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  sessionController.recoverPassword
);

routes.put(
  "/sessions/reset-password",
  celebrate(
    {
      body: Joi.object().keys({
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        password: Joi.string().required(),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  sessionController.resetPassword
);

export default routes;
