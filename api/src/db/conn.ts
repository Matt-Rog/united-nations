import dotenv from "dotenv";
import neo4j from "neo4j-driver";
dotenv.config();

const URI = process.env.NEO4J_URI;
const USER = process.env.NEO4J_USER;
const PASSWORD = process.env.NEO4J_PASS;
const DB = process.env.NEO4J_DB;

export const getDriver = async () => {
  let driver;
  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
    console.log(`Connection estabilished to ${DB}`);
  } catch (err) {
    console.log(`Connection error\n${err}\nCause: ${err.cause}`);
  }
  return driver;
};

export const getSession = async () => {
  const driver = await getDriver();
  const session = driver.session({ database: DB });
  return session;
};
