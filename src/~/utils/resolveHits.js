import getFields from 'graphql-fields'
import buildQuery from './buildQuery'

export default type => async (
  obj,
  { first = 10, offset = 0, filters },
  { es },
  info,
) => {
  // TODO: pass nested fields
  let fields = getFields(info)

  let query = filters || {}

  if (filters) {
    let response = await buildQuery({ type, filters })
    query = response.query
  }

  let { hits } = await es.search({
    index: type.index,
    type: type.es_type,
    size: first,
    from: offset,
    _source: fields.edges && Object.keys(fields.edges.node),
    body: {
      query,
    },
  })

  return {
    hits: hits.hits.map(x => ({ ...x._source, id: x._id })),
    total: hits.total,
  }
}
