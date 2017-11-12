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
  }),
}
