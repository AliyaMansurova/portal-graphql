import { createConnectionDefs, createConnectionResolvers } from './utils'

let type = {
  plural: 'Genes',
  singular: 'Gene',
}

export let typeDefs = createConnectionDefs({
  type,
})

export let resolvers = createConnectionResolvers({
  type,
  esIndex: process.env.ES_GENE_INDEX,
  esType: 'gene_centric',
})
