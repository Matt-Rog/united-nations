import express from "express";

import {
  login,
  register,
  register_discord,
} from "../controllers/authentication";
import { isApp } from "../middlewares";

export default (router: express.Router) => {
  router.post("/auth/register", isApp, register);
  router.post("/auth/login", isApp, login);

  router.get("/auth/discord/register", register_discord);
};
