import { ES_TYPES } from '~/constants'
import { createConnectionResolvers, mappingToFields } from '~/utils'

let type = {
  es_type: 'gene_centric',
  plural: 'Genes',
  singular: 'Gene',
}

export let typeDefs = async () => {
  return mappingToFields({
    type,
  })
}

export let resolvers = {
  ...createConnectionResolvers({
    type,
    esIndex: ES_TYPES[type.es_type].index,
    esType: ES_TYPES[type.es_type].type,
  }),
}
