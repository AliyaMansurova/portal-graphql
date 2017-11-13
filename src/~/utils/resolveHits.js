import getFields from 'graphql-fields'
import { ES_TYPES } from '~/constants'
import buildQuery from './buildQuery'

export default type => async (
  obj,
  { first = 10, offset = 0, filters = {} },
  { es },
  info,
) => {
  // TODO: pass nested fields
  let { query } = await buildQuery({ type, filters })

  let { hits } = await es.search({
    index: ES_TYPES[type.es_type].index,
    type: ES_TYPES[type.es_type].type,
    size: first,
    from: offset,
    _source: Object.keys(getFields(info).edges.node),
    body: {
      query,
    },
  })

  return {
    hits: hits.hits.map(x => ({ ...x._source, id: x._id })),
    total: hits.total,
  }
}
