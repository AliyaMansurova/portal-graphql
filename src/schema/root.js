import {
  typeDefs as ExploreCaseTypeDefs,
  resolvers as ExploreCaseResolvers,
} from './ExploreCases'

let SchemaDefinition = `
  type Project {
    project_id: String
  }

  interface Node {
    id: ID!
  }

  type Explore {
    cases: ExploreCases
  }

  type Root {
    node(id: ID): Node
    viewer: Root
    #user: User
    #query(query: String, types: [String]): QueryResults
    #repository: Repository
    explore: Explore
    #annotations: Annotations
    #projects: Projects
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

export let typeDefs = `
  ${ExploreCaseTypeDefs}
  ${SchemaDefinition}
`

export let resolvers = {
  Root: {
    viewer: () => ({}),
    explore: () => ({}),
  },
  Explore: {
    cases: () => ({}),
  },
  ...ExploreCaseResolvers,
}
