import { createConnectionDefs, createConnectionResolvers } from './utils'

let type = {
  plural: 'ECases',
  singular: 'ECase',
}

export let typeDefs = createConnectionDefs({
  type,
  fields: `
    case_id: String
    primary_site: String
  `,
})

export let resolvers = createConnectionResolvers({
  type,
  esIndex: process.env.ES_CASE_INDEX,
  esType: 'case_centric',
})