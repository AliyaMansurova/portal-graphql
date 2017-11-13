import getFields from 'graphql-fields'
import { ES_TYPES } from '~/constants'
import buildAggregations from './buildAggregations'

let pairToObject = ([a, b]) => ({ [a]: b })

export default type => async (obj, { offset = 0, ...args }, { es }, info) => {
  let graphql_fields = getFields(info)
  let fields = Object.keys(graphql_fields)

  // TODO: build aggs properly

  let { query, aggs } = await buildAggregations({
    type,
    args,
    fields,
    graphql_fields,
  })

  console.log(query, aggs)

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

  console.log(aggregations)

  // TODO: prune aggs

  return Object.entries(aggregations).map(pairToObject)
}
