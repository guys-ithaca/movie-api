import neo4j, { Driver } from 'neo4j-driver';
import { Neo4jConfig } from './neo4j.config';

export const createDriver = async (config: Neo4jConfig) => {
  console.log({ config });
  const driver: Driver = neo4j.driver(
    `${config.scheme}://${config.host}:${config.port}`,
    neo4j.auth.basic(config.username, config.password),
  );

  const info = await driver.getServerInfo();
  console.log({ info });
  return driver;
};
