import mappingToNestedTypes from './mappingToNestedTypes'
import mappingToNestedFields from './mappingToNestedFields'
import mappingToScalarFields from './mappingToScalarFields'
import createConnectionTypeDefs from './createConnectionTypeDefs'
import mappingToObjectTypes from './mappingToObjectTypes'

export default ({ key, type }) => {
  return [
    mappingToObjectTypes(type.name, type.mapping),
    mappingToNestedTypes(type.name, type.mapping),
    createConnectionTypeDefs({
      type,
      fields: [
        mappingToScalarFields(type.mapping),
        mappingToNestedFields(type.name, type.mapping),
        type.customFields,
      ],
    }),
  ].join()
}
