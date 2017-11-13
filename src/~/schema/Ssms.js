import { createConnectionResolvers, mappingToFields } from '~/utils'

let type = {
  es_type: 'ssm_centric',
  plural: 'Ssms',
  singular: 'Ssm',
}

export let typeDefs = async () => {
  return mappingToFields({
    type,
  })
}

export let resolvers = {
  ...createConnectionResolvers({
    type,
  }),
}
