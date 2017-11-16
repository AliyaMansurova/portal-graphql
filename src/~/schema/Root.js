import GraphQLJSON from 'graphql-type-json'
import { startCase } from 'lodash'
import { typeDefs as MutationTypeDefs } from './Mutation'
import { typeDefs as AggregationsTypeDefs } from './Aggregations'
import { createConnectionResolvers, mappingToFields } from '~/utils'

let RootTypeDefs = `
  enum Missing {
    first
    last
  }

  enum Mode {
    avg
    max
    min
    sum
  }

  enum Order {
    asc
    desc
  }

  scalar JSON

  input Sort {
    field: String!
    order: Order
    mode: Mode
    missing: Missing
  }

  interface Node {
    id: ID!
  }

  ${Object.values(global.config.ROOT_TYPES).map(type => type.typeDefs)}

  type Root {
    node(id: ID): Node
    viewer: Root

    ${Object.entries(global.config.ES_TYPES).map(
      ([key, type]) => `${key}: ${type.name}`,
    )}

    ${Object.keys(global.config.ROOT_TYPES).map(
      key => `${key}: ${startCase(key).replace(/\s/g, '')}`,
    )}

    #query(query: String, types: [String]): QueryResults
    #cart_summary: CartSummary
  }

  schema {
    query: Root
    mutation: Mutation
  }
`

export let typeDefs = () => [
  AggregationsTypeDefs,
  RootTypeDefs,
  MutationTypeDefs,
  ...Object.values(global.config.ES_TYPES).map(type =>
    mappingToFields({ type }),
  ),
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
})
