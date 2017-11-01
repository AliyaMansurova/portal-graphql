import { makeExecutableSchema } from 'graphql-tools'
import { typeDefs, resolvers } from './root'

export default makeExecutableSchema({
  typeDefs,
  resolvers,
})
