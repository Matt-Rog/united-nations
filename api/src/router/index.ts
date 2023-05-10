import express from "express";
import authentication from "./authentication";
import users from "./users";
import discord from "./discord";
const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  discord(router);
  return router;
};
