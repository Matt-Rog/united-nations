import express from "express";

import { redirect } from "../controllers/discord";
import { isApp } from "../middlewares";

export default (router: express.Router) => {
  router.get("/discord/redirect", redirect);
};
