import getFields from 'graphql-fields'
import buildQuery from './buildQuery'

let getNested = x =>
  x
    .split('__')
    .slice(0, -1)
    .join('.')

export default type => async (
  obj,
  { first = 10, offset = 0, filters, score, sort },
  { es },
  info,
) => {
  let fields = getFields(info)
  let nested_fields =
    type.nested_fields ||
    (fields.edges && Object.keys(fields.edges.node).map(getNested))

  let query = filters || {}

  if (filters || score) {
    let response = await buildQuery({ type, filters, score, nested_fields })
    query = response.query
  }

  let body = {
    query,
  }

  if (sort)
    body.sort = [
      {
        'summary.case_count': {
          missing: '_last',
          order: 'desc',
          mode: 'min',
        },
      },
    ]

  let { hits } = await es.search({
    index: type.index,
    type: type.es_type,
    size: first,
    from: offset,
    _source: fields.edges && Object.keys(fields.edges.node),
    track_scores: !!score,
    body,
  })

  return {
    hits: hits.hits.map(x => ({ ...x._source, id: x._id })),
    total: hits.total,
  }
}
