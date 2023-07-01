import { createGame, getGameByProp } from "../db/models/games";
import {
  addUserToGame,
  getUserByDiscordId,
  getUserById,
  getUserByProp,
} from "../db/models/users";
import express from "express";
import {
  createGameInvite,
  deleteGameInvite,
  getGameInviteByProp,
} from "../db/models/gameInvites";

// POST /games
export const initGame = async (req: express.Request, res: express.Response) => {
  try {
    const { isDiscord } = req.query;
    let { name, guildId, ownerId } = req.body;

    if (isDiscord) {
      let user = await getUserByDiscordId(ownerId);
      if (!user) {
        return res.status(400).json({ message: "Resources not found" }).end();
      }
      ownerId = user.id;
    }
    let user = await getUserById(ownerId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const game = await createGame({ name, owner: user.id, guildId });
    const can_access = await addUserToGame(user, game);
    return res.status(200).json({ game, can_access });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

// POST /games/:gameId/invites
export const inviteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    let { gameId } = req.params;
    const { isDiscord } = req.query;
    let { userId, expires } = req.body;
    if (isDiscord) {
      // All id's will be discord based
      let game = await getGameByProp({ guildId: gameId });
      let user = await getUserByDiscordId(userId);
      if (!game || !user) {
        return res.status(400).json({ message: "Resources not found" }).end();
      }
      gameId = game.id;
      userId = user.id;
    }
    let game = await getGameByProp({ id: gameId });
    let user = await getUserByProp({ id: userId });
    let invite = await createGameInvite(game, user, expires);
    console.log(invite);
    return res.status(200).json(invite).end();
  } catch (error) {
    return res.sendStatus(400);
  }
};

// DEL /games/:gameId/invites/:inviteId
export const resolveInvite = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    let { gameId, inviteId } = req.params;
    const { isDiscord } = req.query;
    let { userId, accept } = req.body;
    if (isDiscord) {
      // All id's will be discord based
      let game = await getGameByProp({ guildId: gameId });
      let user = await getUserByDiscordId(userId);
      if (!game || !user) {
        return res.status(400).json({ message: "Resources not found" }).end();
      }
      gameId = game.id;
      userId = user.id;
    }
    let game = await getGameByProp({ id: gameId });
    let user = await getUserByProp({ id: userId });

    let invite = await getGameInviteByProp({ id: inviteId });

    if (!game || !user || !invite) {
      return res.status(400).json({ message: "Resources not found" });
    }
    if (accept) {
      if (parseInt(invite.expires) >= Date.now()) {
        return res.status(400).json({ message: "Invite expired" });
      }
      let can_access = await addUserToGame(user, game);
      let i = await deleteGameInvite(invite);
      return res.status(200).json(can_access).end();
    }
    let i = await deleteGameInvite(invite);
    return res.status(200).json(i).end();
  } catch (error) {
    return res.sendStatus(400);
  }
};
