import fs from 'fs'
import { promisify } from 'util'
import { GET_MAPPING } from '~/constants'
import mappingToNestedTypes from './mappingToNestedTypes'
import mappingToNestedFields from './mappingToNestedFields'
import mappingToScalarFields from './mappingToScalarFields'
import createConnectionTypeDefs from './createConnectionTypeDefs'

let readFile = promisify(fs.readFile)

export default async ({ type }) => {
  let mappingFile = await readFile(GET_MAPPING(type.es_type), {
    encoding: 'utf8',
  })

  let mapping = JSON.parse(mappingFile)[type.es_type].properties

  return [
    mappingToNestedTypes(type.singular, mapping),
    createConnectionTypeDefs({
      type,
      mapping,
      fields: [
        mappingToScalarFields(mapping),
        mappingToNestedFields(type.singular, mapping),
        type.customFields,
      ],
    }),
  ].join()
}
