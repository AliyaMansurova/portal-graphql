import { createConnectionResolvers, mappingToFields } from '~/utils'

let type = {
  es_type: 'file',
  plural: 'Files',
  singular: 'File',
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
