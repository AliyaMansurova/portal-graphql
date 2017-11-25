import GraphQLJSON from 'graphql-type-json'
import { startCase } from 'lodash'
import { typeDefs as MutationTypeDefs } from './Mutation'
import { typeDefs as AggregationsTypeDefs } from './Aggregations'
import { typeDefs as SortTypeDefs } from './Sort'
import { createConnectionResolvers, mappingToFields } from '~/utils'

let RootTypeDefs = `
  scalar JSON

  ${Object.keys(global.config.SCALARS).map(type => `scalar ${type}`)}

  interface Node {
    id: ID!
  }

  type FileSize {
    value: Float
  }

  ${Object.values(global.config.ROOT_TYPES).map(type => type.typeDefs)}

  type QueryResults {
    total: Int
    hits: [Node]
  }

  type Root {
    node(id: ID): Node
    viewer: Root
    query(query: String, types: [String]): QueryResults

    ${Object.entries(global.config.ES_TYPES).map(
      ([key, type]) => `${key}: ${type.name}`,
    )}

    ${Object.keys(global.config.ROOT_TYPES).map(
      key => `${key}: ${startCase(key).replace(/\s/g, '')}`,
    )}
  }

  schema {
    query: Root
    # mutation: Mutation
  }
`

export let typeDefs = ({ types }) => [
  RootTypeDefs,
  // MutationTypeDefs,
  AggregationsTypeDefs,
  SortTypeDefs,
  ...types.map(([key, type]) => mappingToFields({ key, type })),
]

let resolveObject = () => ({})

export let resolvers = () => ({
  JSON: GraphQLJSON,
  Root: {
    viewer: resolveObject,
    ...Object.keys({
      ...global.config.ES_TYPES,
      ...global.config.ROOT_TYPES,
    }).reduce(
      (acc, key) => ({
        ...acc,
        [key]: resolveObject,
      }),
      {},
    ),
  },
  ...Object.values(global.config.ES_TYPES).reduce(
    (acc, type) => ({
      ...acc,
      ...createConnectionResolvers({
        type,
      }),
    }),
    {},
  ),
  ...Object.entries(global.config.ROOT_TYPES).reduce(
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
})
