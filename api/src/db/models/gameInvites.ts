import { getSession } from "../conn";

export interface GameInviteSchema {
  id: string;
  gameId: string;
  playerId: string;
  expires: string;
}

export const getGameInviteByProp = async (prop: any) => {
  let key = Object.keys(prop)[0];

  let db = await getSession();
  const result = await db.run(
    `MATCH ()-[i:IS_INVITED_TO]-() WHERE i.${key} = $value 
    RETURN i
    LIMIT 1`,
    { value: prop[key] }
  );
  await db.close();

  return result.records[0] ? result.records[0].get("i").properties : undefined;
};

export const getGameInviteByGameAndUser = async (g: any, u: any) => {
  let db = await getSession();
  const result = await db.run(
    `MATCH (u:User {id: $userId})-[i:IS_INVITED_TO]->(g:Game {id: $gameId})
      RETURN i
      LIMIT 1`,
    { userId: u.id, gameId: g.id }
  );
  await db.close();

  return result.records[0] ? result.records[0].get("i").properties : undefined;
};

export const createGameInvite = async (g: any, u: any, expires: any) => {
  let db = await getSession();
  const result = await db.run(
    `
    MATCH (g:Game {id: $gameId}), (u:User {id: $userId})
    MERGE (u)-[i:IS_INVITED_TO {id: randomUUID(), gameId: $gameId, expires: $expires}]-(g)
    RETURN i
    `,
    {
      gameId: g.id,
      userId: u.id,
      expires,
    }
  );
  await db.close();

  return result.records[0].get("i").properties;
};

export const deleteGameInvite = async (i: any) => {
  let db = await getSession();
  const result = await db.run(
    `MATCH ()-[i:IS_INVITED_TO]-()
    WHERE i.id = $inviteId
    DELETE i`,
    { inviteId: i.id }
  );
  await db.close();
  return i;
};
