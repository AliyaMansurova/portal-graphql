import { createConnectionResolvers, mappingToFields } from '~/utils'

let type = {
  es_type: 'annotation',
  plural: 'Annotations',
  singular: 'Annotation',
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
