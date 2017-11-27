import { makeExecutableSchema } from 'graphql-tools'
import {
  typeDefs as generateTypeDefs,
  resolvers as generateResolvers,
} from './Root'

export default async ({ types }) => {
  let typeDefs = generateTypeDefs({ types })
  let resolvers = generateResolvers({ types })

  return makeExecutableSchema({
    typeDefs,
    resolvers,
  })
}
