import express from "express";

import UserController from "@controllers/UserController";

const userController = new UserController();

const routes = express.Router();

routes.get("/");

routes.get("/users", userController.index);

export default routes;
