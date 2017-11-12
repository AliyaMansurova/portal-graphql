import {
  mappingToScalarFields,
  mappingToNestedTypes,
  mappingToAggsType,
} from '~/utils'

test('mappingToScalarFields', () => {
  mappingToScalarFields({
    case_id: {
      type: 'keyword',
    },
  }).forEach(field => expect(field).toBe('case_id: String'))
})

test('mappingToNestedTypes', () => {
  let actual = mappingToNestedTypes('ECase', {
    diagnoses: {
      type: 'nested',
      properties: {
        age_at_diagnosis: {
          type: 'long',
        },
        treatments: {
          type: 'nested',
          properties: {
            days_to_treatment: {
              type: 'long',
            },
          },
        },
      },
    },
  })

  let expected = [
    `
    type ECaseDiagnosesTreatments {
      days_to_treatment: Float
    }
    type ECaseDiagnoses {
      age_at_diagnosis: Float
      treatments: [ECaseDiagnosesTreatments]
    }
  `,
  ]

  actual.every((type, i) =>
    expect(type.replace(/\s/g, '')).toBe(expected[i].replace(/\s/g, '')),
  )
})

test('mappingToAggsType', () => {
  let actual = mappingToAggsType({
    diagnoses: {
      type: 'nested',
      properties: {
        age_at_diagnosis: {
          type: 'long',
        },
        treatments: {
          type: 'nested',
          properties: {
            state: {
              type: 'keyword',
            },
          },
        },
      },
    },
  })

  let expected = [
    'diagnoses__age_at_diagnosis: NumericAggregations',
    'diagnoses__treatments__state: Aggregations',
  ]

  expect(actual.length).toBe(expected.length)
  actual.forEach((x, i) => expect(x).toBe(expected[i]))
})
