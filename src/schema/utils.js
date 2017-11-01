export let createConnectionDefs = ({ type, fields = '' }) => `
  type ${type.plural} {
    hits(first: Int offset: Int): ${type.singular}Connection
    #aggregations: [${type.singular}Aggregations]
  }

  type ${type.singular}Connection {
    total: Int!
    edges: [${type.singular}Edge]
  }

  type ${type.singular}Edge {
    node: ${type.singular}
  }

  type ${type.singular} implements Node {
    id: ID!
    ${fields}
  }
`

export let createConnectionResolvers = ({ type, esIndex, esType }) => ({
  [type.plural]: {
    hits: async (obj, { first = 10, offset = 0 }, { es }, info) => {
      let { hits } = await es.search({
        index: esIndex,
        type: esType,
        size: first,
        from: offset,
      })

      return {
        hits: hits.hits.map(x => ({ ...x._source, id: x._id })),
        total: hits.total,
      }
    },
  },
  [type.singular + 'Connection']: {
    edges: edges => edges.hits,
  },
  [type.singular + 'Edge']: {
    node: node => node,
  },
})
