import express from "express";
import { isApp } from "../middlewares";
import { initGame } from "../controllers/games";

export default (router: express.Router) => {
  router.post("/games/create", isApp, initGame);
};
