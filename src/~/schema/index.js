import { makeExecutableSchema } from 'graphql-tools'
import {
  typeDefs as generateTypeDefs,
  resolvers as generateResolvers,
} from './Root'

export default async ({ types, rootTypes }) => {
  let typeDefs = generateTypeDefs({ types, rootTypes })
  let resolvers = generateResolvers({ types, rootTypes })

  return makeExecutableSchema({
    typeDefs,
    resolvers,
  })
}
