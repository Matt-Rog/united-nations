import express from "express";
import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserById,
} from "../db/users";
import { authentication, random } from "../helpers";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Incomplete form data",
        body: JSON.stringify(req.body),
      });
    }
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const expectedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password !== expectedHash.toString()) {
      return res.status(403).json({ message: "Incorrect email or password" });
    }
    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    ).toString();

    await user.save();

    res.cookie("UNITED-NATIONS-AUTH", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({ message: "Incomplete fields" });
    }
    const user = await getUserByEmail(email);
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = random();
    let newUser = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
      identities: {
        discord_user_id: 0,
      },
    });
    const pfp_user = await getUserByEmail(newUser.email);
    pfp_user.pfp_url = `https://source.boringavatars.com/beam/120/${newUser._id}?colors=61d4b0,8ee696,baf77c,e8ff65,ecedd5`;
    await pfp_user.save();
    return res.status(200).json(pfp_user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
export const register_discord = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { code } = req.query;
    if (code) {
      const formData = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.TOKEN,
        grant_type: "authorization_code",
        code,
        redirect_uri: "https://api.un.mattrog.com/auth/discord/redirect",
      };
      const response = await fetch("https://discord.com/api/oauth2/token");
    }
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({ message: "Incomplete fields" });
    }
    const user = await getUserByEmail(email);
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = random();
    let newUser = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
      identities: {
        discord_user_id: 0,
      },
    });
    const pfp_user = await getUserByEmail(newUser.email);
    pfp_user.pfp_url = `https://source.boringavatars.com/beam/120/${newUser._id}?colors=61d4b0,8ee696,baf77c,e8ff65,ecedd5`;
    await pfp_user.save();
    return res.status(200).json(pfp_user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
