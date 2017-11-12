import { createConnectionResolvers, mappingToFields } from '~/utils'

let type = {
  es_type: 'case_centric',
  plural: 'ECases',
  singular: 'ECase',
}

export let typeDefs = async () => {
  return mappingToFields({
    type,
    custom: `
      available_variation_data: [String]
    `,
  })
}

export let resolvers = {
  ...createConnectionResolvers({
    type,
  }),
}
