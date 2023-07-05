import { createGame, getGameByProp, deleteGameById } from "../db/models/games";
import {
  addUserToGame,
  createUser,
  getUserByDiscordId,
  getUserById,
  getUserByProp,
  getUserGames,
} from "../db/models/users";
import express from "express";
import {
  createGameInvite,
  deleteGameInvite,
  getGameInviteByProp,
  getGameInviteByGameAndUser,
} from "../db/models/gameInvites";

export const getGame = async (req: express.Request, res: express.Response) => {
  try {
    const { isDiscord } = req.query;
    let { gameId } = req.params;
    if (isDiscord) {
      let game = await getGameByProp({ guildId: gameId });
      if (!game) {
        return res.status(400).json({ message: "Resources not found" }).end();
      }
      gameId = game.id;
    }
    let game = await getGameByProp({ id: gameId });
    if (!game) {
      return res.status(400).json({ message: "Resources not found" }).end();
    }
    return res.status(200).json(game);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

// POST /games
export const initGame = async (req: express.Request, res: express.Response) => {
  try {
    const { isDiscord } = req.query;
    let { name, guildId, ownerId } = req.body;
    if (isDiscord) {
      let game = await getGameByProp({ guildId });
      if (game) {
        return res
          .status(400)
          .json({ message: "Game already exists for current guild." })
          .end();
      }
      let user = await getUserByDiscordId(String(ownerId));
      if (!user) {
        return res.status(400).json({ message: "Invalid creator" }).end();
      }
      ownerId = user.id;
    }
    let user = await getUserById(ownerId);
    if (!user) {
      return res.status(400).json({ message: "Invalid creator" });
    }
    const game = await createGame({ name, owner: user.id, guildId });
    const can_access = await addUserToGame(user, game);
    return res.status(200).json({ game, can_access });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

// DELETE /games/:gameId?userId={userId}
export const deleteGame = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    let { gameId } = req.params;
    const { isDiscord } = req.query;
    let { userId } = req.query;
    if (isDiscord) {
      let game = await getGameByProp({ guildId: gameId });
      let user = await getUserByDiscordId(String(userId));
      if (!game || !user) {
        return res.status(400).json({ message: "Resources not found" }).end();
      }
      gameId = game.id;
      userId = user.id;
    }
    let game = await getGameByProp({ id: gameId });
    let user = await getUserByProp({ id: userId });
    if (!game || !user) {
      return res.status(400).json({ message: "Resources not found" }).end();
    }
    if (game.owner !== user.id) {
      return res.status(401).json({ message: "User unauthorized" }).end();
    }
    await deleteGameById(game.id);
    return res.status(200).json(game).end();
  } catch (error) {
    return res.status(400).json({ message: error }).end();
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
    let { inviter, invitees } = req.body;
    if (isDiscord) {
      // All id's will be discord based
      let game = await getGameByProp({ guildId: gameId });
      let user = await getUserByDiscordId(inviter);
      if (!game || !user) {
        return res.status(400).json({ message: "Resources not found" }).end();
      }
      gameId = game.id;
      inviter = user.id;
    }
    let game = await getGameByProp({ id: gameId });
    inviter = await getUserByProp({ id: inviter });

    // Invitier authorization check
    let inviterGames = await getUserGames(inviter);
    if (!inviterGames.map((game: any) => game.id).includes(game.id)) {
      return res.status(401).json({ message: "User not authorized" }).end();
    }

    let invites = [];
    // Create invites
    for (var inviteRequest of invitees) {
      // Check if invitee exists
      let user = await getUserByProp({ id: inviteRequest.userId });

      if (isDiscord) {
        user = await getUserByDiscordId(inviteRequest.userId);
        if (!user) {
          // Create temp user if not existing
          user = await createUser({
            username: "USER YET TO CONNECT DISCORD",
            email: inviteRequest.userId,
            avatarUrl: "NA",
            discord: {
              id: inviteRequest.userId,
              accessToken: "NA",
            },
          });
        }
      } else if (!user) {
        return res
          .status(400)
          .json({ message: "Invited user does not exist." })
          .end();
      }
      // Check for existing invite + cannot invite self
      let invite = await getGameInviteByGameAndUser(game, user);
      if (!invite && user.id !== inviter.id) {
        invite = await createGameInvite(game, user, inviteRequest.expires);
        invites.push(invite);
      }
    }

    return res.status(200).json(invites).end();
  } catch (error) {
    console.log(error);
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
