import fs from 'fs'
import { promisify } from 'util'
import {
  createConnectionDefs,
  createConnectionResolvers,
  mappingToNestedTypes,
  mappingToScalarFields,
  mappingToNestedFields,
} from './utils'

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

  return [
    mappingToNestedTypes(type.singular, mapping),
    createConnectionDefs({
      type,
      fields: [
        mappingToScalarFields(mapping),
        mappingToNestedFields(type.singular, mapping),
        'available_variation_data: [String]',
      ],
    }),
  ].join()
}

export let resolvers = createConnectionResolvers({
  type,
  esIndex: process.env.ES_ECASE_INDEX,
  esType: 'case_centric',
})
