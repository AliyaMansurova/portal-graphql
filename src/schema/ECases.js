import fs from 'fs'
import { promisify } from 'util'
import { createConnectionResolvers, mappingToFields } from './utils'

let readFile = promisify(fs.readFile)

let type = {
  plural: 'ECases',
  singular: 'ECase',
}

export let typeDefs = async () => {
  let mappingFile = await readFile('src/mappings/case_centric.mapping.json', {
    encoding: 'utf8',
  })

  let mapping = JSON.parse(mappingFile).case_centric.properties

  return mappingToFields({
    type,
    mapping,
    custom: `
      available_variation_data: [String]
    `,
  })
}

export let resolvers = {
  ...createConnectionResolvers({
    type,
    esIndex: process.env.ES_ECASE_INDEX,
    esType: 'case_centric',
  }),
}
