import fetch from 'node-fetch'

let api = `${process.env.GDCAPI}/graphql`

export default ({ type, filters }) =>
  fetch(api + '/build_filters', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filters,
      doc_type: type.plural.toLowerCase(),
      nested: [],
    }),
  }).then(r => r.json())
