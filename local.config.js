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
      analyte_ids: [String]
      slide_ids: [String]
      portion_ids: [String]
      sample_ids: [String]
      submitter_aliquot_ids: [String]
      submitter_analyte_ids: [String]
      submitter_sample_ids: [String]
      submitter_slide_ids: [String]
      submitter_portion_ids: [String]
      available_variation_data: [String]
      id: ID!
    `,
  },
}

export let ROOT_TYPES = {}
