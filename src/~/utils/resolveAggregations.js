import getFields from 'graphql-fields'
import { ES_TYPES } from '~/constants'
import buildAggregations from './buildAggregations'
import pruneAggregations from './pruneAggregations'

let getNested = x =>
  x
    .split('__')
    .slice(0, -1)
    .join('.')

let toGraphqlField = ([a, b]) => ({ [a.replace(/\./g, '__')]: b })

export default type => async (obj, { offset = 0, ...args }, { es }, info) => {
  let graphql_fields = getFields(info)
  let fields = Object.keys(graphql_fields)
  let nested_fields = fields.map(getNested)

  let { query, aggs } = await buildAggregations({
    type,
    args,
    fields,
    graphql_fields,
    nested_fields,
  })

  let { aggregations } = await es.search({
    index: ES_TYPES[type.es_type].index,
    type: ES_TYPES[type.es_type].type,
    size: 0,
    _source: false,
    body: {
      query,
      aggs,
    },
  })

  // TODO: prune aggs

  let { pruned } = await pruneAggregations({
    aggs: aggregations,
    nested_fields,
  })

  return Object.entries(pruned).map(toGraphqlField)
}
