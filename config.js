export let ES_TYPES = {
  cases: {
    index: process.env.ES_GDC_FROM_GRAPH_INDEX,
    es_type: process.env.ES_CASE_TYPE,
    name: 'Case',
    customFields: `
      aliquot_ids: [String]
      available_variation_data: [String]
      id: ID!
    `,
  },
}

export let ROOT_TYPES = {}
