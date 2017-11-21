import GraphQLJSON from 'graphql-type-json'

export let JSONScalar = 'FiltersArgument'

export let SCALARS = {
  FiltersArgument: GraphQLJSON,
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
