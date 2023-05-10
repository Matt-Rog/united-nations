import express from "express";
import { get, merge } from "lodash";
import { getUserBySessionToken } from "../db/users";
import dotenv from "dotenv";
dotenv.config();

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["UNITED-NATIONS-AUTH"];
    if (!sessionToken) {
      return res.status(403).json({ message: "No token provided" });
    }
    const user = await getUserBySessionToken(sessionToken);
    if (!user) {
      return res
        .status(403)
        .json({ message: "Non-existent token", token: sessionToken });
    }

    merge(req, { identity: user });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;
    if (!currentUserId) {
      return res.sendStatus(403);
    }
    if (currentUserId.toString() !== id) {
      return res.status(403);
    }
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const isApp = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(403).json({ message: "No app token provided" });
    }
    if (token.toString() !== process.env.TOKEN) {
      return res.status(403).json({ message: "Not an authorized app" });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
