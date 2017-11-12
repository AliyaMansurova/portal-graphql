import { ES_TYPES } from '~/constants'

export default type => async (obj, { offset = 0 }, { es }, info) => {
  let aggs = { case_id: { terms: { field: 'case_id', size: 100 } } }

  // TODO: build aggs properly

  let { aggregations } = await es.search({
    index: ES_TYPES[type.es_type].index,
    type: ES_TYPES[type.es_type].type,
    size: 0,
    _source: false,
    body: {
      // aggs: Object.keys(getFields(info)),
      aggs,
    },
  })

  // TODO: prune aggs

  return Object.entries(aggregations)
  return {
    hits: hits.hits.map(x => ({ ...x._source, id: x._id })),
    total: hits.total,
  }
}
