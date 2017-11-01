import { makeExecutableSchema } from 'graphql-tools'

let query = `
  type Project {
    project_id: String
  }

  type ExploreCase {
    case_id: String
    project: Project
  }

  type ExploreCases {
    total: Int
    hits: [ExploreCase]
  }

  type Explore {
    cases(first: Int offset: Int): ExploreCases
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

let resolvers = {
  Query: {
    explore: () => ({}),
  },
  Explore: {
    cases: async (obj, { first = 10, offset = 0 }, { es }, info) => {
      let { hits } = await es.search({
        index: process.env.ES_CASE_INDEX,
        type: 'case_centric',
        size: first,
        from: offset,
      })

      return {
        hits: hits.hits.map(x => x._source),
        total: hits.total,
      }
    },
  },
  ExploreCases: {
    hits: d => d.hits,
  },
  ExploreCase: {
    project: d => d.project,
  },
}

export default makeExecutableSchema({
  typeDefs,
  resolvers,
})
