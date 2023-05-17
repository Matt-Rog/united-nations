import express from "express";
import authentication from "./authentication";
import users from "./users";
import discord from "./discord";
import games from "./games";
const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  games(router);
  discord(router);
  return router;
};
