import React from 'react'
import Query from '~/ui/Query'

export default ({ type, mapping }) => {
  let scalarFields = Object.entries(mapping)
    .filter(([, metadata]) => metadata.type && metadata.type !== 'nested')
    .map(([field]) => field)

  return (
    <div>
      <h1>{type} list</h1>

      <Query
        name="TableQuery"
        query={`
          query {
            ${type} {
              hits {
                total
                edges {
                  node {
                    id
                    ${scalarFields}
                  }
                }
              }
            }
          }
        `}
      >
        {data =>
          data && (
            <table>
              <thead>
                <tr>
                  {scalarFields.map(field => <th key={field}>{field}</th>)}
                </tr>
              </thead>
              <tbody>
                {data[type].hits.edges.map(({ node }) => (
                  <tr key={node.id}>
                    {scalarFields.map(field => (
                      <th key={field}>{node[field]}</th>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </Query>
    </div>
  )
}
