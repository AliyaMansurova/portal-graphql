import { createConnectionResolvers, mappingToFields } from '~/utils'

let type = {
  es_type: 'case',
  plural: 'Cases',
  singular: 'Case',
}

export let typeDefs = async () => {
  return mappingToFields({
    type,
    custom: `
      aliquot_ids: [String]
      available_variation_data: [String]
    `,
  })
}

export let resolvers = {
  ...createConnectionResolvers({
    type,
  }),
}
