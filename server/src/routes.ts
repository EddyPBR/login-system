import express from "express";

import UserController from "@controllers/UserController";
import SessionController from "@controllers/SessionController";

const userController = new UserController();
const sessionController = new SessionController();

const routes = express.Router();

routes.get("/users", userController.index);
routes.get("/users/:_id", userController.search);
routes.post("/users", userController.create);
routes.put("/users/:_id", userController.update);
routes.delete("/users/:_id", userController.delete);

routes.post("/sessions", sessionController.authenticate);

export default routes;
