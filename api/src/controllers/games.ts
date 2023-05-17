import { createGame } from "../db/models/games";
import { addUserToGame, getUserByDiscordId } from "../db/models/users";
import express, { response } from "express";

export const initGame = async (req: express.Request, res: express.Response) => {
  try {
    const { name, discordId } = req.body;
    const user = await getUserByDiscordId(discordId);
    if (!user) {
      return res.status(403).json({ message: "User does not exist." });
    }
    const game = await createGame({ name, owner: user.id });
    const plays_in = await addUserToGame(user.id, game.id);
    return res.status(200).json(plays_in);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
