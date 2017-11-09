import { mappingToScalarFields } from './utils'

test('works', () => {
  mappingToScalarFields({
    case_id: {
      type: 'keyword',
    },
  }).every(field => expect(field).toBe('case_id: String'))
})
