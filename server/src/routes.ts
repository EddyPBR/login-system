import express from "express";

import UserController from "@controllers/UserController";

const userController = new UserController();

const routes = express.Router();

routes.get("/users", userController.index);
routes.post("/users", userController.create);
routes.put("/users/:_id", userController.update);

export default routes;
