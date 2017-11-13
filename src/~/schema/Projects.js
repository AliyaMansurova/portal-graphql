import { createConnectionResolvers, mappingToFields } from '~/utils'

let type = {
  es_type: 'project',
  plural: 'Projects',
  singular: 'Project',
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
