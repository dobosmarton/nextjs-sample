import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-micro';
import { MicroRequest } from 'apollo-server-micro/dist/types';
import { ServerResponse } from 'http';
import { buildSchemaSync } from 'type-graphql';
import Cors from 'micro-cors';
import { UserResolver } from '../../server/resolvers/user';

const schema = buildSchemaSync({
  resolvers: [UserResolver],
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors();

const apolloServer = new ApolloServer({ schema });

const startServer = apolloServer.start();

export default cors(async (req: MicroRequest, res: ServerResponse) => {
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }

  await startServer;
  await apolloServer.createHandler({ path: '/api/graphql' })(req, res);
});
