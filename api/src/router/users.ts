import express from "express";

import {
  // deleteUser,
  getAllUsers,
  // getUserByProp,
  // getUserGames,
  // updateUser,
} from "../controllers/users";
import { isApp, isAuthenticated, isOwner } from "../middlewares";

export default (router: express.Router) => {
  router.get("/users", isApp, getAllUsers);
  // router.get("/users/:email", isApp, getUserByProp);
  // router.get("/users/:id", isApp, getUserByProp);
  // router.get("/users/:id/games", isApp, getUserGames);

  // router.delete("/users/:id", isAuthenticated, isOwner, deleteUser);
  // router.patch("/users/:id", isAuthenticated, isOwner, updateUser);
};
