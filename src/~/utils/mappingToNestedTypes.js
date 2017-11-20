import { capitalize } from 'lodash'
import mappingToNestedTypes from './mappingToNestedTypes'
import mappingToNestedFields from './mappingToNestedFields'
import mappingToScalarFields from './mappingToScalarFields'

export default (type, mapping) => {
  return Object.entries(mapping)
    .filter(([, metadata]) => !metadata.type || metadata.type === 'nested')
    .map(
      ([field, metadata]) => `
        ${mappingToNestedTypes(
          type + capitalize(field),
          metadata.properties,
        ).join('\n')}
        type ${type + capitalize(field)} {
          ${mappingToScalarFields(metadata.properties)}
          ${mappingToNestedFields(
            type + capitalize(field),
            metadata.properties,
          ).join('\n')}
        }
      `,
    )
}
