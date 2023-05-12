import express, { response } from "express";

import { getUsers, getUserById, getUserByEmail } from "../db/models/users";

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

// export const updateUser = async (
//   req: express.Request,
//   res: express.Response
// ) => {
//   try {
//     const { id } = req.params;
//     const { username } = req.body;
//     if (!username) {
//       return res.sendStatus(400);
//     }
//     const user = await getUserById(id);
//     user.username = username;
//     await user.save();
//     return res.status(200).json(user).end();
//   } catch (error) {
//     console.log(error);
//     return res.sendStatus(400);
//   }
// };

// export const deleteUser = async (
//   req: express.Request,
//   res: express.Response
// ) => {
//   try {
//     const { id } = req.params;
//     const deletedUser = await deleteUserById(id);
//     return response.json(deletedUser);
//   } catch (error) {
//     console.log(error);
//     return res.sendStatus(400);
//   }
// };

// export const getUserByProp = async (
//   req: express.Request,
//   res: express.Response
// ) => {
//   try {
//     const { id, email } = req.params;
//     let user = {};
//     if (email) {
//       user = await getUserByEmail(email);
//     } else if (id) {
//       user = await getUserById(id);
//     }
//     return res.status(200).json(user).end();
//   } catch (error) {
//     return res.status(400);
//   }
// };

// export const getUserGames = async (
//   req: express.Request,
//   res: express.Response
// ) => {
//   try {
//     const { id } = req.params;
//     let user = await getUserById(id);
//     if (user) {
//       let games = [];
//       for (let i = 0; i < user.games.length; i++) {
//         let game = await getGameById(user.games[i]);
//         games.push(game);
//       }
//       return res.status(200).json(games).end();
//     } else {
//       return res.status(400);
//     }
//   } catch (error) {
//     return res.status(400);
//   }
// };
