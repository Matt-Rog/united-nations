import express from "express";

import {
  // deleteUser,
  getAllUsers,
  getUserByProp,
  // getUserByProp,
  // getUserGames,
  // updateUser,
} from "../controllers/users";
import { isApp, isAuthenticated, isOwner } from "../middlewares";

export default (router: express.Router) => {
  router.get("/users", isApp, getAllUsers);
  router.get("/users/:prop", isApp, getUserByProp);
};
