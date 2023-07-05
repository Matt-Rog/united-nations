import express from "express";

import {
  getAllUsers,
  getUserByProp,
  getGamesForUser,
} from "../controllers/users";
import { isApp, isAuthenticated, isOwner } from "../middlewares";

export default (router: express.Router) => {
  router.get("/users", isApp, getAllUsers);
  router.get("/users/:prop", isApp, getUserByProp);
  router.get("/users/:prop/games", isApp, getGamesForUser);
};
