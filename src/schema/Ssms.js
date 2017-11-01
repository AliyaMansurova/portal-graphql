import { createConnectionDefs, createConnectionResolvers } from './utils'

let type = {
  plural: 'Ssms',
  singular: 'Ssm',
}

export let typeDefs = createConnectionDefs({
  type,
})

export let resolvers = createConnectionResolvers({
  type,
  esIndex: process.env.ES_SSM_INDEX,
  esType: 'ssm_centric',
})
