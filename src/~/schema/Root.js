import GraphQLJSON from 'graphql-type-json'
import { ES_TYPES } from '~/constants'
import { typeDefs as MutationTypeDefs } from './Mutation'
import { typeDefs as AggregationsTypeDefs } from './Aggregations'
import { typeDefs as UserTypeDefs } from './User'
import {
  typeDefs as RepositoryTypeDefs,
  resolvers as RepositoryResolvers,
} from './Repository'
import {
  typeDefs as ExploreTypeDefs,
  resolvers as ExploreResolvers,
} from './Explore'

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

  type TopCasesCountByGenes {
    data(
      first: Int
      gene_ids: [String]
      filters: JSON
    ): JSON
  }

  type ProteinMutations {
    data(
      first: Int
      offset: Int
      fields: [String]!
      score: String
      filters: JSON
    ): JSON
  }

  type Analysis {
    protein_mutations: ProteinMutations
    top_cases_count_by_genes: TopCasesCountByGenes
    pvalue(data: [[Int]]!): Float
  }

  type Root {
    node(id: ID): Node
    viewer: Root @deprecated (reason: "Use top level fields for ES types.")
    repository: Repository @deprecated (reason: "Use top level fields for ES types.")
    explore: Explore @deprecated (reason: "Use top level fields for ES types.")

    ${Object.entries(ES_TYPES).map(([key, type]) => `${key}: ${type.plural}`)}

    user: User
    #query(query: String, types: [String]): QueryResults
    #cart_summary: CartSummary
    analysis: Analysis
  }

  schema {
    query: Root
    mutation: Mutation
  }
`

export let typeDefs = () => [
  AggregationsTypeDefs,
  UserTypeDefs,
  RepositoryTypeDefs,
  ExploreTypeDefs,
  RootTypeDefs,
  MutationTypeDefs,
  ...Object.values(ES_TYPES).map(type => mappingToFields({ type })),
]

let resolveObject = () => ({})

export let resolvers = () => ({
  JSON: GraphQLJSON,
  Root: {
    viewer: resolveObject,
    user: resolveObject,
    repository: resolveObject,
    explore: resolveObject,
    ...Object.keys(ES_TYPES).reduce(
      (acc, key) => ({
        ...acc,
        [key]: resolveObject,
      }),
      {},
    ),
  },
  ...Object.values(ES_TYPES).reduce(
    (acc, type) => ({
      ...acc,
      ...createConnectionResolvers({
        type,
      }),
    }),
    {},
  ),

  // deprecated wrappers
  ...RepositoryResolvers,
  ...ExploreResolvers,
})
