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
            <span className="section-title">
              <span>Results</span>
            </span>
            <span className="showing">
              <span>2 of {data[type].hits.total}</span>
            </span>
            <div
              style={{
                overflowX: 'auto',
                height: 'calc(100vh - 135px)',
                overflow: 'auto',
              }}
            >
              <table className="pure-table smaller pure-table-bordered">
                <thead>
                  <tr>
                    {scalarFields.map(field => <th key={field}>{field}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {data[type].hits.edges.map(({ node }) => (
                    <tr key={node.id}>
                      {scalarFields.map(field => (
                        <td key={field}>{node[field]}</td>
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