// import { gql } from 'apollo-server-express';
import { readFileSync } from 'fs';

const typeDefs = readFileSync(require.resolve('./graphql/tiangong.gql')).toString('utf-8');

export default typeDefs;
