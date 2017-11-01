export let typeDefs = `
  type ExploreCases {
    hits(first: Int offset: Int): ECaseConnection
    #aggregations: [ExploreCaseAggregations]
  }

  type ECaseConnection {
    total: Int!
    edges: [ECaseEdge]
  }

  type ECaseEdge {
    node: ECase
  }

  type ECase implements Node {
    id: ID!
    case_id: String
    primary_site: String
  }
`

export let resolvers = {
  ExploreCases: {
    hits: async (obj, { first = 10, offset = 0 }, { es }, info) => {
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
  ECaseConnection: {
    edges: edges => edges.hits,
  },
  ECaseEdge: {
    node: node => node,
  },
}
