import JSONType from './JSONTypeTemp'

export let JSONScalar = 'FiltersArgument'

export let SCALARS = {
  [JSONScalar]: JSONType(JSONScalar),
}

export let ES_TYPES = {
  cases: {
    index: 'gdc_from_graph',
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
