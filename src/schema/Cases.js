import { createConnectionDefs, createConnectionResolvers } from './utils'

let type = {
  plural: 'Cases',
  singular: 'Case',
}

export let typeDefs = async () => {
  return mappingToFields({
    type,
    custom: `
      available_variation_data: [String]
    `,
  })
}

export let resolvers = createConnectionResolvers({
  type,
  esIndex: process.env.ES_CASE_INDEX,
  esType: 'case',
})
