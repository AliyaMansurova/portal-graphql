import { capitalize } from 'lodash'

export default (type, mapping) =>
  Object.entries(mapping)
    .filter(([, metadata]) => metadata.type === 'nested')
    .map(
      ([field, metadata]) => `
          ${field}: [${type + capitalize(field)}]
        `,
    )
