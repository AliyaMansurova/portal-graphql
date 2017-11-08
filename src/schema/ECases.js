import {
  createConnectionDefs,
  createConnectionResolvers,
  mappingToNestedTypes,
  mappingToScalarFields,
  mappingToNestedFields,
} from './utils'

let type = {
  plural: 'ECases',
  singular: 'ECase',
}

export let typeDefs = mapping =>
  [
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

export let resolvers = createConnectionResolvers({
  type,
  esIndex: process.env.ES_ECASE_INDEX,
  esType: 'case_centric',
})
