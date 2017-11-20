import getFields from 'graphql-fields'
import buildAggregations from './buildAggregations'
import pruneAggregations from './pruneAggregations'

let getNested = x =>
  x
    .split('__')
    .slice(0, -1)
    .join('.')

let toGraphqlField = (acc, [a, b]) => ({ ...acc, [a.replace(/\./g, '__')]: b })

export default type => async (obj, { offset = 0, ...args }, { es }, info) => {
  let graphql_fields = getFields(info)
  let fields = Object.keys(graphql_fields).filter(
    x => !x.includes('_autocomplete'),
  )
  let nested_fields = type.nested_fields

  let { query, aggs } = await buildAggregations({
    type,
    args,
    fields,
    graphql_fields,
    nested_fields,
  })

  let { aggregations } = await es.search({
    index: type.index,
    type: type.es_type,
    size: 0,
    _source: false,
    body: {
      query,
      aggs,
    },
  })

  let { pruned } = await pruneAggregations({
    aggs: aggregations,
    nested_fields,
  })

  return Object.entries(pruned).reduce(toGraphqlField, {})
}
