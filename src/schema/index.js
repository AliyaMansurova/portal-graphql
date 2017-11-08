import { makeExecutableSchema } from 'graphql-tools'
import {
  typeDefs as generateTypeDefs,
  resolvers as generateResolvers,
} from './Root'

export default async () => {
  let tt = generateTypeDefs()
  let typeDefs = await Promise.all(generateTypeDefs())
  // let resolvers = await generateResolvers()

  return makeExecutableSchema({
    typeDefs,
    resolvers: {},
  })
}
