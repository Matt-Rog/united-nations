import { getSession } from "../conn";

export interface PlayerSchema {
  id: string; // randomUUID()
  gameId: string;
  name: string;
  title: string;
  bio: string;
}

// WRITE
export const createPlayer = async (p: any) => {
  let db = await getSession();
  const result = await db.run(
    `MERGE (p:Player {
          id: randomUUID(),
          gameId: $gameId,
          name: $name,
          title: $title,
          bio: $bio
        })
        RETURN p`,
    {
      gameId: p.gameId,
      name: p.name,
      title: p.title,
      bio: p.bio,
    }
  );
  await db.close();

  return result.records[0].get("p").properties;
};

export const addPlayerToGame = async (p: any, g: any) => {
  let db = await getSession();
  const result = await db.run(
    `MATCH (p:Player {id: '${p.id}'}),(g:Game {id: '${g.id}'})
      MERGE (p)-[pi:PLAYS_IN {createdAt: '${Date.now()}'}]-(g)
      RETURN pi`
  );
  await db.close();

  return result.records[0].get("pi").properties;
};

export const addPlayerToUser = async (p: any, u: any) => {
  let db = await getSession();
  const result = await db.run(
    `MATCH (p:Player {id: '${p.id}'}),(u:User {id: '${u.id}'})
      MERGE (u)-[pa:PLAYS_AS {createdAt: '${Date.now()}'}]-(p)
      RETURN pa`
  );
  await db.close();

  return result.records[0].get("pa").properties;
};
