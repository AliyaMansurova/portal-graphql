import { makeExecutableSchema } from 'graphql-tools'
import {
  typeDefs as generateTypeDefs,
  resolvers as generateResolvers,
} from './Root'

export default async () => {
  let typeDefs = await Promise.all(generateTypeDefs())
  let resolvers = generateResolvers()

  return makeExecutableSchema({
    typeDefs,
    resolvers,
  })
}
