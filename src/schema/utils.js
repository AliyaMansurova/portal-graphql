import fs from 'fs'
import { promisify } from 'util'
import getFields from 'graphql-fields'
import { capitalize, flattenDeep } from 'lodash'
import { GET_MAPPING } from '../constants'

let readFile = promisify(fs.readFile)

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

export let esToAggTypeMap = {
  string: 'Aggregations',
  object: 'Aggregations',
  text: 'Aggregations',
  boolean: 'Aggregations',
  date: 'Aggregations',
  keyword: 'Aggregations',
  id: 'Aggregations',
  long: 'NumericAggregations',
  double: 'NumericAggregations',
  integer: 'NumericAggregations',
  float: 'NumericAggregations',
}

// __ : maybe String -> String
// add two underscores after a value if it exists
// used to create fields representing es paths
// why? because graphql fields cannot contain dots
// diagnoses.treatments 👎
// vs
// diagnoses__treatments 👍
let __ = x => (x ? x + '__' : '')

export let flattenFields = (properties, parent = '') =>
  flattenDeep(
    Object.entries(properties).map(
      ([field, data]) =>
        data.type && data.type !== 'nested'
          ? `${__(parent) + field}: ${esToAggTypeMap[data.type]}`
          : flattenFields(data.properties, __(parent) + field),
    ),
  )

export let createConnectionDefs = ({ type, mapping, fields = '' }) => `
  type ${type.plural} {
    hits(
      score: String
      query: String
      offset: Int
      sort: [Sort]
      filters: FiltersArgument
      before: String
      after: String
      first: Int
      last: Int
    ): ${type.singular}Connection

    aggregations(
      filters: FiltersArgument

      # Should term aggregations be affected by queries that contain filters on their field. For example if a query is filtering primary_site by Blood should the term aggregation on primary_site return all values or just Blood. Set to False for UIs that allow users to select multiple values of an aggregation.
      aggregations_filter_themselves: Boolean
    ): [${type.plural}Aggregations]
  }

  type ${type.plural}Aggregations {
    ${flattenFields(mapping)}
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
        _source: Object.keys(getFields(info).edges.node),
      })

      return {
        hits: hits.hits.map(x => ({ ...x._source, id: x._id })),
        total: hits.total,
      }
    },
    aggregations: async (obj, { offset = 0 }, { es }, info) => {
      let aggs = { case_id: { terms: { field: 'case_id', size: 100 } } }

      // TODO: build aggs properly

      let { aggregations } = await es.search({
        index: esIndex,
        type: esType,
        size: 0,
        _source: false,
        body: {
          // aggs: Object.keys(getFields(info)),
          aggs,
        },
      })

      console.log(123, aggregations)

      // TODO: prune aggs

      return Object.entries(aggregations)
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

export let mappingToNestedTypes = (type, mapping) =>
  Object.entries(mapping)
    .filter(([, metadata]) => metadata.type === 'nested')
    .map(
      ([field, metadata]) => `
        ${mappingToNestedTypes(type + capitalize(field), metadata.properties)}
        type ${type + capitalize(field)} {
          ${mappingToScalarFields(metadata.properties)}
          ${mappingToNestedFields(
            type + capitalize(field),
            metadata.properties,
          )}
        }
      `,
    )

export let mappingToNestedFields = (type, mapping) =>
  Object.entries(mapping)
    .filter(([, metadata]) => metadata.type === 'nested')
    .map(
      ([field, metadata]) => `
          ${field}: [${type + capitalize(field)}]
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

export let mappingToFields = async ({ type, custom }) => {
  let mappingFile = await readFile(GET_MAPPING(type.es_type), {
    encoding: 'utf8',
  })

  let mapping = JSON.parse(mappingFile)[type.es_type].properties

  return [
    mappingToNestedTypes(type.singular, mapping),
    createConnectionDefs({
      type,
      mapping,
      fields: [
        mappingToScalarFields(mapping),
        mappingToNestedFields(type.singular, mapping),
        custom,
      ],
    }),
  ].join()
}
