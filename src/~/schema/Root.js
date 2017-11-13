import GraphQLJSON from 'graphql-type-json'
import { ES_TYPES } from '~/constants'
import { typeDefs as MutationTypeDefs } from './Mutation'
import { typeDefs as AggregationsTypeDefs } from './Aggregations'
import {
  typeDefs as ECasesTypeDefs,
  resolvers as ECasesResolvers,
} from './ECases'
import {
  typeDefs as AnnotationsTypeDefs,
  resolvers as AnnotationsResolvers,
} from './Annotations'
import { typeDefs as CasesTypeDefs, resolvers as CasesResolvers } from './Cases'
import { typeDefs as FilesTypeDefs, resolvers as FilesResolvers } from './Files'
import { typeDefs as GenesTypeDefs, resolvers as GenesResolvers } from './Genes'
import { typeDefs as SsmsTypeDefs, resolvers as SsmsResolvers } from './Ssms'
import {
  typeDefs as ProjectsTypeDefs,
  resolvers as ProjectsResolvers,
} from './Projects'
import { typeDefs as UserTypeDefs } from './User'
import {
  typeDefs as RepositoryTypeDefs,
  resolvers as RepositoryResolvers,
} from './Repository'
import {
  typeDefs as ExploreTypeDefs,
  resolvers as ExploreResolvers,
} from './Explore'

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

  type Root {
    node(id: ID): Node
    viewer: Root
    repository: Repository
    explore: Explore
    case: Cases
    file: Files
    case_centric: ECases
    gene_centric: Genes
    ssm_centric: Ssms
    project: Projects
    projects: Projects

    # placeholder
    ssm_occurrence_centric: String
    
    user: User
    annotation: Annotations
    annotations: Annotations
    #query(query: String, types: [String]): QueryResults
    #cart_summary: CartSummary
    #analysis: Analysis
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
  AnnotationsTypeDefs(),
  ProjectsTypeDefs(),
  FilesTypeDefs(),
  CasesTypeDefs(),
  ECasesTypeDefs(),
  GenesTypeDefs(),
  SsmsTypeDefs(),
  RootTypeDefs,
  MutationTypeDefs,
]

export let resolvers = () => ({
  Root: {
    viewer: () => ({}),
    user: () => ({}),
    repository: () => ({}),
    explore: () => ({}),
    annotations: () => ({}),
    projects: () => ({}),
    ...Object.keys(ES_TYPES).reduce(
      (acc, key) => ({
        ...acc,
        [key]: () => ({}),
      }),
      {},
    ),
  },
  ...RepositoryResolvers,
  ...ExploreResolvers,
  ...AnnotationsResolvers,
  ...ProjectsResolvers,
  ...FilesResolvers,
  ...CasesResolvers,
  ...ECasesResolvers,
  ...GenesResolvers,
  ...SsmsResolvers,
  JSON: GraphQLJSON,
})
