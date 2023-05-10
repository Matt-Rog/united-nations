import express from "express";
import url from "url";
import fetch from "node-fetch";
export const redirect = async (req: express.Request, res: express.Response) => {
  try {
    const { code } = req.query;
    if (code) {
      try {
        var formData = new url.URLSearchParams({
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: "authorization_code",
          code: code.toString(),
          redirect_uri: "http://localhost:8080/discord/redirect",
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

        const user_response = await fetch("https://discord.com/api/users/@me", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        let user_data = await user_response.json();
        console.log(user_data);
        return res.status(response.status).json(user_data).end();
      } catch (error) {
        return res.sendStatus(403);
      }
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
