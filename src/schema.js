import { makeExecutableSchema } from 'graphql-tools'

let query = `
  type Project {
    project_id: String
  }

  type ECase {
    case_id: String
    project: Project
  }

  type ExploreCases {
    hits(first: Int offset: Int): [ECase]
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

let ExploreCases = {
  hits: async (obj, { first = 10, offset = 0 }, { es }, info) => {
    let { hits } = await es.search({
      index: process.env.ES_CASE_INDEX,
      type: 'case_centric',
      size: first,
      from: offset,
    })

    return hits.hits.map(x => x._source)
  },
}

let ECase = {
  project: d => d.project,
}

let resolvers = {
  Query: {
    explore: () => ({}),
  },
  Explore: {
    cases: () => ({}),
  },
  ExploreCases,
  ECase,
}

export default makeExecutableSchema({
  typeDefs,
  resolvers,
})
