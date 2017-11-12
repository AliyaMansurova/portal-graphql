import { createConnectionDefs, createConnectionResolvers } from '~/utils'

let type = {
  plural: 'Annotations',
  singular: 'Annotation',
}

export let typeDefs = async () => {
  return mappingToFields({
    type,
  })
}

export let resolvers = createConnectionResolvers({
  type,
  esIndex: process.env.ES_ANNOTATION_INDEX,
  esType: 'annotation',
})
