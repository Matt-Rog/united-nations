import { getUserByDiscordId, getUserByProp } from "../db/models/users";
import { getGameByProp } from "../db/models/games";
import {
  addPlayerToGame,
  addPlayerToUser,
  createPlayer,
} from "../db/models/players";
import express from "express";
//POST /games/:id/players
export const onBoard = async (req: express.Request, res: express.Response) => {
  try {
    let { gameId } = req.params;
    const { isDiscord } = req.query;
    let { name, title, bio, userId } = req.body;
    if (isDiscord) {
      console.log("hi");
      let game = await getGameByProp({ guildId: gameId });
      let user = await getUserByDiscordId(userId);
      if (!game || !user) {
        return res.status(400).json({ message: "Resources not found" }).end();
      }
      gameId = game.id;
      userId = user.id;
    }
    let game = await getGameByProp({ id: gameId });
    console.log("game" + game);
    let user = await getUserByProp({ id: userId });
    console.log("user" + user);

    if (!game || !user) {
      return res.status(400).json({ message: "Resources not found" }).end();
    }
    const player = await createPlayer({
      gameId: game.id,
      name: name,
      title: title,
      bio: bio,
    });
    console.log("player" + player);

    const plays_as = await addPlayerToUser(player, user);
    console.log("plasas" + plays_as);

    const plays_in = await addPlayerToGame(player, game);
    console.log("playsin" + plays_in);

    // ETC .. assigning to nation, relationship handling
    return res.status(200).json({ plays_as, plays_in }).end();
  } catch (error) {
    return res.status(400).json({ message: error }).end();
  }
};

// DELETE /games/:gameId/players/:playerId
