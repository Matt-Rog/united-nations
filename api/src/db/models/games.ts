import { getSession } from "../conn";

export interface GameSchema {
  id: string; // randomUUID()
  name: string;
  createdAt: string;
  guildId: string;
  owner: string;
}

function deserialize(g: GameSchema) {
  return g;
}

export const getGameByProp = async (prop: any) => {
  let db = await getSession();
  let key = Object.keys(prop)[0];
  const result = await db.run(
    `MATCH (g:Game {${key}: $value}) RETURN g LIMIT 1`,
    {
      value: prop[key],
    }
  );
  await db.close();

  return result.records[0]
    ? deserialize(result.records[0].get("g").properties)
    : undefined;
};

// WRITE
export const createGame = async (g: any) => {
  let db = await getSession();
  const result = await db.run(
    `MERGE (g:Game {
        id: randomUUID(),
        name: $name,
        owner: $owner,
        guildId: $guildId,
        createdAt: ${Date.now()}
      })
      RETURN g`,
    {
      name: g.name,
      owner: g.owner,
      guildId: g.guildId,
    }
  );
  await db.close();

  return deserialize(result.records[0].get("g").properties);
};

export const deleteGameById = async (gameId: string) => {
  let db = await getSession();
  const result = await db.run(
    `MATCH (g:Game {id: $gameId})
      DETACH DELETE g`,
    {
      gameId,
    }
  );
  await db.close();
};
