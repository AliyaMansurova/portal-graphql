import GraphQLJSON from 'graphql-type-json'
import { startCase } from 'lodash'
import { typeDefs as MutationTypeDefs } from './Mutation'
import { typeDefs as AggregationsTypeDefs } from './Aggregations'
import { typeDefs as SortTypeDefs } from './Sort'
import { createConnectionResolvers, mappingToFields } from '~/utils'

let RootTypeDefs = ({ types }) => `
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

    ${types.map(([key, type]) => `${key}: ${type.name}`)}
  }

  schema {
    query: Root
    # mutation: Mutation
  }
`

// ${Object.values(global.config.ROOT_TYPES).map(type => type.typeDefs)}

//
// ${Object.keys(global.config.ROOT_TYPES).map(
//   key => `${key}: ${startCase(key).replace(/\s/g, '')}`,
// )}

export let typeDefs = ({ types }) => [
  RootTypeDefs({ types }),
  // MutationTypeDefs,
  AggregationsTypeDefs,
  SortTypeDefs,
  ...types.map(([key, type]) => mappingToFields({ key, type })),
]

let resolveObject = () => ({})

export let resolvers = ({ types }) => {
  return {
    JSON: GraphQLJSON,
    Root: {
      viewer: resolveObject,
      ...types.reduce(
        (acc, [key]) => ({
          ...acc,
          [key]: resolveObject,
        }),
        {},
      ),
      // ...Object.keys({
      //   ...global.config.ES_TYPES,
      //   ...global.config.ROOT_TYPES,
      // }).reduce(
      //   (acc, key) => ({
      //     ...acc,
      //     [key]: resolveObject,
      //   }),
      //   {},
      // ),
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
    // ...Object.values(global.config.ES_TYPES).reduce(
    //   (acc, type) => ({
    //     ...acc,
    //     ...createConnectionResolvers({
    //       type,
    //     }),
    //   }),
    //   {},
    // ),
    // ...Object.entries(global.config.ROOT_TYPES).reduce(
    //   (acc, [key, type]) => ({
    //     ...acc,
    //     ...(type.resolvers
    //       ? { [startCase(key).replace(/\s/g, '')]: type.resolvers }
    //       : {}),
    //   }),
    //   {},
    // ),
    ...Object.entries(global.config.SCALARS).reduce(
      (acc, [scalar, resolver]) => ({
        ...acc,
        [scalar]: resolver,
      }),
      {},
    ),
  }
}
