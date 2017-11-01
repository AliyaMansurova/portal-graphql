import { createConnectionDefs, createConnectionResolvers } from './utils'

let type = {
  plural: 'Files',
  singular: 'File',
}

export let typeDefs = createConnectionDefs({
  type,
})

export let resolvers = createConnectionResolvers({
  type,
  esIndex: process.env.ES_FILE_INDEX,
  esType: 'file',
})
