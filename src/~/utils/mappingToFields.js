import { readFile, mappingFolder } from '~/utils'
import mappingToNestedTypes from './mappingToNestedTypes'
import mappingToNestedFields from './mappingToNestedFields'
import mappingToScalarFields from './mappingToScalarFields'
import createConnectionTypeDefs from './createConnectionTypeDefs'

export default async ({ type }) => {
  let mappingFile = await readFile(mappingFolder(type.es_type), {
    encoding: 'utf8',
  })

  let mapping = JSON.parse(mappingFile)[type.es_type].properties

  return [
    mappingToNestedTypes(type.name, mapping),
    createConnectionTypeDefs({
      type,
      mapping,
      fields: [
        mappingToScalarFields(mapping),
        mappingToNestedFields(type.name, mapping),
        type.customFields,
      ],
    }),
  ].join()
}
