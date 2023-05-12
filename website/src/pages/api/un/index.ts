import { base_url } from "@/utils/api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = process.env.TOKEN;
  let body = JSON.parse(req.body);
  const method = body.method;
  const endpoint = body.endpoint;
  const payload = body.payload;
  const params = body.params;
  let url =
    base_url +
    endpoint +
    `?${
      params
        ? params
            .map((p: any) => {
              var key = Object.keys(p)[0];
              var val = Object.values(p)[0];
              return `${key}=${val}`;
            })
            .join("&")
        : ""
    }&token=${token}`;

  let response = undefined;
  if (method === "GET") {
    response = await fetch(url, {
      method: method,
    });
  } else {
    response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      method: method,
      body: JSON.stringify(payload),
    });
  }
  let data = await response.json();
  console.log(data);
  return res.status(response.status).json(data);
}
