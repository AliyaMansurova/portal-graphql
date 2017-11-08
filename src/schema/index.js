import { makeExecutableSchema } from 'graphql-tools'
import { typeDefs, resolvers } from './Root'

export default mappings =>
  makeExecutableSchema({
    typeDefs: typeDefs(mappings),
    resolvers: resolvers(mappings),
  })
