import { makeExecutableSchema } from 'graphql-tools'
import { typeDefs, resolvers } from './Root'

export default makeExecutableSchema({
  typeDefs,
  resolvers,
})
