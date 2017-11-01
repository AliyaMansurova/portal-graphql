import { createConnectionDefs, createConnectionResolvers } from './utils'

let type = {
  plural: 'Projects',
  singular: 'Project',
}

export let typeDefs = createConnectionDefs({
  type,
})

export let resolvers = createConnectionResolvers({
  type,
  esIndex: process.env.ES_PROJECT_INDEX,
  esType: 'project',
})
