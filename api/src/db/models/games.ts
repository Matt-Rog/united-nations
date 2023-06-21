import { getSession } from "../conn";

export interface GameSchema {
  id: string; // randomUUID()
  name: string;
  createdAt: string;
}

function deserialize(g: GameSchema) {
  return g;
}

// WRITE
export const createGame = async (g: any) => {
  let db = await getSession();
  const result = await db.run(
    `MERGE (g:Game {
        id: randomUUID(),
        name: $name,
        owner: $owner,
        createdAt: ${Date.now()}
      })
      RETURN g`,
    {
      name: g.name,
      owner: g.owner,
    }
  );
  return deserialize(result.records[0].get("g").properties);
};
