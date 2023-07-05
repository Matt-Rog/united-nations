import express from "express";
import { isApp } from "../middlewares";
import {
  deleteGame,
  getGame,
  initGame,
  inviteUser,
  resolveInvite,
} from "../controllers/games";
import { onBoard } from "../controllers/players";

export default (router: express.Router) => {
  router.get("/games/:gameId", isApp, getGame);
  router.post("/games", isApp, initGame);
  router.delete("/games/:gameId", isApp, deleteGame);

  // PLAYERS
  router.post("/games/:gameId/players", isApp, onBoard);

  // INVITES
  router.post("/games/:gameId/invites", isApp, inviteUser);
  router.delete("/games/:gameId/invites/:inviteId", isApp, resolveInvite);
};
