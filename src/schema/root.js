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
  interface Node {
    id: ID!
  }

  type Root {
    node(id: ID): Node
    viewer: Root
    #repository: Repository
    explore: Explore
    #projects: Projects
    #user: User
    #annotations: Annotations
    #query(query: String, types: [String]): QueryResults
    #cart_summary: CartSummary
    #analysis: Analysis
  }

  schema {
    query: Root
  }
`

// let mutation = `
//   # this schema allows the following mutation:
//   type Mutation {
//     upvotePost (
//       postId: Int!
//     ): Post
//   }
// `

export let typeDefs = () => [
  // UserTypeDefs,
  // RepositoryTypeDefs,
  ExploreTypeDefs,
  // AnnotationsTypeDefs,
  // ProjectsTypeDefs,
  // FilesTypeDefs,
  // CasesTypeDefs,
  ECasesTypeDefs(),
  GenesTypeDefs(),
  // SsmsTypeDefs,
  RootTypeDefs,
]

export let resolvers = () => ({
  Root: {
    viewer: () => ({}),
    // user: () => ({}),
    // annotations: () => ({}),
    // repository: () => ({}),
    explore: () => ({}),
    // repository: () => ({}),
  },
  // ...RepositoryResolvers,
  ...ExploreResolvers,
  // ...AnnotationsResolvers,
  // ...ProjectsResolvers,
  // ...FilesResolvers,
  // ...CasesResolvers,
  ...ECasesResolvers,
  ...GenesResolvers,
  // ...SsmsResolvers,
})
