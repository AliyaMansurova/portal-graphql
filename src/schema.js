import { makeExecutableSchema } from 'graphql-tools'

let query = `
  type ECase {
    id: String
  }

  type ExploreCases {
    hits: [ECase]
  }

  type Explore {
    cases: ExploreCases
  }

  type Query {
    explore: Explore
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

let typeDefs = `
  ${query}

`

let ECase1 = {
  id: () => '1',
}

let ECase2 = {
  id: () => '2',
}

let ExploreCases = {
  hits: () => [ECase1, ECase2],
}

let Explore = {
  cases: () => ExploreCases,
}

let resolvers = {
  Query: {
    explore: () => Explore,
  },
}

export default makeExecutableSchema({
  typeDefs,
  resolvers,
})
