import { getSession } from "../conn";

export interface GameSchema {
  id: string; // randomUUID()
  name: string;
  guildId: string;
  createdAt: string;
}
function deserialize(g: GameSchema) {
  return g;
}

// READ
export const getGameByProp = async (prop: any) => {
  let key = Object.keys(prop)[0];
  let db = await getSession();
  const result = await db.run(
    `MATCH (g:Game {
      ${key}: $value
    })
    RETURN g`,
    {
      value: prop[key],
    }
  );
  await db.close();

  return result.records[0].get("g").properties;
};

export const getGameUsers = async (g: any) => {};

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
