import { ES_TYPES } from '~/constants'

let pairToObject = ([a, b]) => ({ [a]: b })

export default type => async (obj, { offset = 0 }, { es }, info) => {
  let aggs = { primary_site: { terms: { field: 'primary_site', size: 100 } } }

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

  return Object.entries(aggregations).map(pairToObject)
}
