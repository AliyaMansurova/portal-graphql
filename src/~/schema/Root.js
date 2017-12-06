import GraphQLJSON from 'graphql-type-json'
import { startCase } from 'lodash'
import { typeDefs as MutationTypeDefs } from './Mutation'
import { typeDefs as AggregationsTypeDefs } from './Aggregations'
import { typeDefs as SortTypeDefs } from './Sort'
import { createConnectionResolvers, mappingToFields } from '~/utils'

let RootTypeDefs = ({ types, rootTypes }) => `
  scalar JSON

  ${Object.keys(global.config.SCALARS).map(type => `scalar ${type}`)}

  interface Node {
    id: ID!
  }

  type FileSize {
    value: Float
  }

  type QueryResults {
    total: Int
    hits: [Node]
  }

  type Root {
    node(id: ID): Node
    viewer: Root
    query(query: String, types: [String]): QueryResults
    ${rootTypes.map(([key]) => `${key}: ${startCase(key).replace(/\s/g, '')}`)}
    ${types.map(([key, type]) => `${key}: ${type.name}`)}
  }

  ${rootTypes.map(([, type]) => type.typeDefs)}

  schema {
    query: Root
    # mutation: Mutation
  }
`

export let typeDefs = ({ types, rootTypes }) => [
  RootTypeDefs({ types, rootTypes }),
  // MutationTypeDefs,
  AggregationsTypeDefs,
  SortTypeDefs,
  ...types.map(([key, type]) => mappingToFields({ key, type })),
]

let resolveObject = () => ({})

export let resolvers = ({ types, rootTypes }) => {
  return {
    JSON: GraphQLJSON,
    Root: {
      viewer: resolveObject,
      ...[...types, ...rootTypes].reduce(
        (acc, [key]) => ({
          ...acc,
          [key]: resolveObject,
        }),
        {},
      ),
    },
    ...types.reduce(
      (acc, [key, type]) => ({
        ...acc,
        ...createConnectionResolvers({
          type,
        }),
      }),
      {},
    ),
    ...rootTypes.reduce(
      (acc, [key, type]) => ({
        ...acc,
        ...(type.resolvers
          ? { [startCase(key).replace(/\s/g, '')]: type.resolvers }
          : {}),
      }),
      {},
    ),
    ...Object.entries(global.config.SCALARS).reduce(
      (acc, [scalar, resolver]) => ({
        ...acc,
        [scalar]: resolver,
      }),
      {},
    ),
  }
}
