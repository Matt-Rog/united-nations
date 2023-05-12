import express from "express";

import { auth, register_discord } from "../controllers/authentication";
import { isApp } from "../middlewares";

export default (router: express.Router) => {
  router.post("/auth", isApp, auth);

  router.get("/auth/discord/register", register_discord);
};
