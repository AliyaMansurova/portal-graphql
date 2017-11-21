import React from 'react'
import Query from '~/ui/Query'

export default ({ type, mapping }) => {
  let scalarFields = Object.entries(mapping)
    .filter(([, metadata]) => metadata.type && metadata.type !== 'nested')
    .map(([field]) => field)

  return (
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
          <div
            style={{
              width: 'calc(100% - 600px)',
            }}
          >
            <div className="section-title">
              <span>Table</span>
            </div>
            <div
              style={{
                overflowX: 'auto',
              }}
            >
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
            </div>
          </div>
        )}
    </Query>
  )
}
