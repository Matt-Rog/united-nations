import { getSession } from "../conn";
import { GameSchema } from "./games";

export interface UserSchema {
  id: string; // randomUUID()
  username: string;
  email: string;
  createdAt: string;
  avatarUrl: string;
  discord: DiscordInfo; // {\"id\": string, \"access_token\": string}
}
interface DiscordInfo {
  id: string;
  accessToken: string;
}

function deserialize(u: UserSchema) {
  u.discord = JSON.parse(u.discord.toString()) as DiscordInfo;
  return u;
}

// READ //
export const getUsers = async () => {
  let db = await getSession();
  const result = await db.run(`Match (u:User) return u`);
  await db.close();

  return result.records.map((i: any) => deserialize(i.get("u").properties));
};

export const getUserById = async (id: string) => {
  let db = await getSession();
  const result = await db.run(
    `MATCH (u:User {id : '${id}'} ) return u limit 1`
  );
  await db.close();

  return result.records[0]
    ? deserialize(result.records[0].get("u").properties)
    : undefined;
};

export const getUserByEmail = async (email: string) => {
  let db = await getSession();
  const result = await db.run(
    `MATCH (u:User {email: '${email}'}) return u limit 1`
  );
  await db.close();

  return result.records[0]
    ? deserialize(result.records[0].get("u").properties)
    : undefined;
};

export const getUserByDiscordId = async (discordId: string) => {
  let db = await getSession();
  const result = await db.run(`MATCH (u:User) 
    WHERE u.discord CONTAINS '${String(discordId)}'
    return u limit 1`);
  var user = result.records[0]
    ? deserialize(result.records[0].get("u").properties)
    : undefined;
  await db.close();

  return user?.discord?.id == discordId ? user : undefined;
};

export const getUserByProp = async (prop: any) => {
  let db = await getSession();
  let key = Object.keys(prop)[0];
  const result = await db.run(
    `MATCH (u:User {${key}: $value}) RETURN u LIMIT 1`,
    {
      value: prop[key],
    }
  );
  await db.close();

  return result.records[0]
    ? deserialize(result.records[0].get("u").properties)
    : undefined;
};

// WRITE //
export const createUser = async (u: any) => {
  let db = await getSession();
  console.log(u);
  const result = await db.run(
    `MERGE (u:User {
        id: randomUUID(),
        username: $username,
        email: $email,
        createdAt: ${Date.now()},
        avatarUrl: $avatarUrl,
        discord: "{\\"id\\": \\"${u.discord.id}\\", \\"accessToken\\": \\"${
      u.discord.accessToken
    }\\" }"
      })
      RETURN u`,
    {
      username: u.username,
      email: u.email,
      avatarUrl: u.avatarUrl,
    }
  );
  await db.close();
  return result.records[0]
    ? deserialize(result.records[0].get("u").properties)
    : undefined;
};

export const updateUserById = async (id: string, u: any) => {
  let db = await getSession();
  const result = await db.run(
    `MATCH (u:User {id: '${id}'})
            SET u.username= '${u.username}',
            u.email= '${u.email}',
            u.createdAt= '${u.createdAt}',
            u.avatarUrl= '${u.avatarUrl}',
            u.discord= "{\\"id\\": \\"${u.discord.id}\\", \\"accessToken\\": \\"${u.discord.accessToken}\\" }"
        RETURN u`
  );
  await db.close();

  return deserialize(result.records[0].get("u").properties);
};

export const addUserToGame = async (u: any, g: any) => {
  let db = await getSession();
  const result = await db.run(
    `MATCH (u:User {id: '${u.id}'}),(g:Game {id: '${g.id}'})
    MERGE (u)-[c:CAN_ACCESS {joinedAt: '${Date.now()}'}]-(g)
    RETURN c`
  );
  await db.close();

  return result.records[0].get("c").properties;
};

export const getUserGames = async (u: any) => {
  let db = await getSession();
  const result = await db.run(
    `MATCH (u:User {id: '${u.id}'})-[:CAN_ACCESS]->(g:Game)
    RETURN g`
  );
  await db.close();
  console.log(result.records);
  let games = result.records.map((record) => record.get("g").properties);
  console.log(games);
  return games;
};
