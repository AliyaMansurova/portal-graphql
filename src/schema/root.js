import {
  typeDefs as ECasesTypeDefs,
  resolvers as ECasesResolvers,
} from './ECases'

import { typeDefs as GenesTypeDefs, resolvers as GenesResolvers } from './Genes'

let SchemaDefinition = `
  type Project {
    project_id: String
  }

  interface Node {
    id: ID!
  }

  type Explore {
    cases: ECases
    genes: Genes
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
  ${ECasesTypeDefs}
  ${GenesTypeDefs}
  ${SchemaDefinition}
`

export let resolvers = {
  Root: {
    viewer: () => ({}),
    explore: () => ({}),
  },
  Explore: {
    cases: () => ({}),
    genes: () => ({}),
  },
  ...ECasesResolvers,
  ...GenesResolvers,
}
