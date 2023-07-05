import express, { response } from "express";

import {
  getUsers,
  getUserById,
  getUserByEmail,
  getUserGames,
} from "../db/models/users";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getUserByProp = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { prop } = req.params;
    const emailUser = await getUserByEmail(prop);
    const idUser = await getUserById(prop);
    var user;
    if (emailUser) {
      user = emailUser;
    } else if (idUser) {
      user = idUser;
    }
    if (user) {
      return res.status(200).json(user).end();
    }
    return res.status(400).json({ message: "User not found" }).end();
  } catch (error) {
    return res.status(400).json({ message: "Error fetching user" }).end();
  }
};

export const getGamesForUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { prop } = req.params;
    const emailUser = await getUserByEmail(prop);
    const idUser = await getUserById(prop);
    var user;
    if (emailUser) {
      user = emailUser;
    } else if (idUser) {
      user = idUser;
    }
    if (user) {
      const games = await getUserGames(user);
      return res.status(200).json(games).end();
    }
  } catch (error) {
    return res.status(400);
  }
};
