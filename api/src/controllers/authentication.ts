import express from "express";
import {
  createUser,
  getUserByDiscordId,
  getUserByEmail,
  updateUserById,
} from "../db/models/users";
import url from "url";
import fetch from "node-fetch";

export const auth = async (req: express.Request, res: express.Response) => {
  try {
    const { email, id, username, avatar } = req.body;
    var accessToken = req.query.accessToken.toString();
    if (!email || !id || !username) {
      return res.status(400).json({ message: "Incomplete fields" });
    }
    var user = await getUserByEmail(email);
    if (user) {
      // LOGIN
      // Check email & discord id correct
      var byDiscordUser = await getUserByDiscordId(id);
      if (byDiscordUser.id == user.id) {
        user.discord.accessToken = accessToken;
        user = await updateUserById(user.id, user);
        return res.status(200).json(user).end();
      } else {
        return res.status(400).json({ message: "Login failed" });
      }
    } else {
      // REGISTER
      var newUser = {
        username,
        email,
        avatarUrl:
          avatar !== undefined
            ? `https://cdn.discordapp.com/avatars/${id}/${avatar}`
            : `https://source.boringavatars.com/beam/120/${id}?colors=61d4b0,8ee696,baf77c,e8ff65,ecedd5`,
        discord: {
          id,
          accessToken,
        },
      };
      newUser = await createUser(newUser);
      return res.status(200).json(newUser).end();
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error authorizing user" });
  }
};
export const register_discord = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { code } = req.query;
    if (code) {
      var formData = new url.URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code.toString(),
        redirect_uri: "http://localhost:8080/auth/discord/register",
      });
      const response = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        body: formData.toString(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      let data = await response.json();
      const { access_token } = data;
      console.log(access_token);
      const user_response = await fetch("https://discord.com/api/users/@me", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      let user_data = await user_response.json();

      return res.status(response.status).json(user_data).end();
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
