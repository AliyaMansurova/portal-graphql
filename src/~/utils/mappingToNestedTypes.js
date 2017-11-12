import { capitalize } from 'lodash'
import mappingToNestedTypes from './mappingToNestedTypes'
import mappingToNestedFields from './mappingToScalarFields'
import mappingToScalarFields from './mappingToScalarFields'

export default (type, mapping) =>
  Object.entries(mapping)
    .filter(([, metadata]) => metadata.type === 'nested')
    .map(
      ([field, metadata]) => `
        ${mappingToNestedTypes(type + capitalize(field), metadata.properties)}
        type ${type + capitalize(field)} {
          ${mappingToScalarFields(metadata.properties)}
          ${mappingToNestedFields(
            type + capitalize(field),
            metadata.properties,
          )}
        }
      `,
    )
