import { getSession } from "../conn";

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
  return result.records.map((i: any) => deserialize(i.get("u").properties));
};

export const getUserById = async (id: string) => {
  let db = await getSession();
  const result = await db.run(
    `MATCH (u:User {id : '${id}'} ) return u limit 1`
  );
  return result.records[0]
    ? deserialize(result.records[0].get("u").properties)
    : undefined;
};

export const getUserByEmail = async (email: string) => {
  let db = await getSession();
  const result = await db.run(
    `MATCH (u:User {email: '${email}'}) return u limit 1`
  );
  return result.records[0]
    ? deserialize(result.records[0].get("u").properties)
    : undefined;
};

export const getUserByDiscordId = async (discordId: string) => {
  let db = await getSession();
  const result = await db.run(`MATCH (u:User) 
    WHERE u.discord CONTAINS '${discordId}'
    return u limit 1`);
  var user = result.records[0]
    ? deserialize(result.records[0].get("u").properties)
    : undefined;
  return user?.discord?.id == discordId ? user : undefined;
};

export const getUserByProp = async (prop: { [name: string]: any }) => {
  let db = await getSession();
  let name = Object.keys(prop)[0];
  const result = await db.run(
    `MATCH (u:User {${prop.name}: ${prop.name}}) RETURN u LIMIT 1`
  );
  return result.records[0]
    ? deserialize(result.records[0].get("u").properties)
    : undefined;
};

// WRITE //
export const createUser = async (u: any) => {
  let db = await getSession();
  const result = await db.run(
    `MATCH (u:User {
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
  return deserialize(result.records[0].get("u").properties);
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
  return deserialize(result.records[0].get("u").properties);
};

export const addUserToGame = async (uid: string, gid: string) => {
  let db = await getSession();
  const result = await db.run(
    `MATCH (u:User {id: '${uid}'}),(g:Game {id: '${gid}'})
    MERGE (u)-[p:PLAYS_IN {joinedAt: '${Date.now()}'}]-(g)
    RETURN p`
  );
  return result.records[0].get("p").properties;
};
