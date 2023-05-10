import express from "express";

import { login, register } from "../controllers/authentication";
import { isApp } from "../middlewares";

export default (router: express.Router) => {
  router.post("/auth/register", isApp, register);
  router.post("/auth/login", isApp, login);
};
