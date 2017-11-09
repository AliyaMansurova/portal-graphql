import { createConnectionDefs, createConnectionResolvers } from './utils'

let type = {
  plural: 'Ssms',
  singular: 'Ssm',
}

export let typeDefs = async () => {
  return mappingToFields({
    type,
  })
}

export let resolvers = createConnectionResolvers({
  type,
  esIndex: process.env.ES_SSM_INDEX,
  esType: 'ssm_centric',
})
