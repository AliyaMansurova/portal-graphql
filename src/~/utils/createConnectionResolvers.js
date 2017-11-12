import getFields from 'graphql-fields'

type TcreateConnectionResolversArgs = {
  type: Object,
  esIndex: String,
  esType: String,
}
type TcreateConnectionResolvers = (
  args: TcreateConnectionResolversArgs,
) => Object
let createConnectionResolvers: TcreateConnectionResolvers = ({
  type,
  esIndex,
  esType,
}) => ({
  [type.plural]: {
    hits: async (
      obj,
      { first = 10, offset = 0, filters = {} },
      { es },
      info,
    ) => {
      // let query = {
      //   bool: {
      //     must: [
      //       {
      //         terms: {
      //           case_id: ['a25a714e-c142-482b-91c8-4fea763e0254'],
      //           boost: 0,
      //         },
      //       },
      //     ],
      //   },
      // }

      let { hits } = await es.search({
        index: esIndex,
        type: esType,
        size: first,
        from: offset,
        _source: Object.keys(getFields(info).edges.node),
        body: {
          query: {},
        },
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

export default createConnectionResolvers
