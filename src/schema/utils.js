export let esToGraphqlTypeMap = {
  keyword: 'String',
  string: 'String',
  text: 'String',
  date: 'String',
  boolean: 'Boolean',
  long: 'Float',
  double: 'Float',
  integer: 'Float',
  float: 'Float',
}

export let mappingToNestedTypes = (type, mapping) =>
  Object.entries(mapping)
    .filter(([, metadata]) => metadata.type === 'nested')
    .map(
      ([field, metadata]) => `
        type ${type + field} {
          ${mappingToScalarFields(metadata.properties)}
          ${mappingToNestedFields(type + field, metadata.properties)},
        }
    `,
    )

export let mappingToNestedFields = (type, mapping) =>
  Object.entries(mapping)
    .filter(([, metadata]) => metadata.type === 'nested')
    .map(
      ([field, metadata]) => `
            ${field}: ${type + field}
        `,
    )

export let mappingToScalarFields = mapping =>
  Object.entries(mapping)
    .filter(([, metadata]) =>
      Object.keys(esToGraphqlTypeMap).includes(metadata.type),
    )
    .map(
      ([field, metadata]) => `${field}: ${esToGraphqlTypeMap[metadata.type]}`,
    )

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
