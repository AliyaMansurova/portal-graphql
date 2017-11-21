import React from 'react'
import Query from '~/ui/Query'
import { parse } from 'query-string'
import { Route } from 'react-router-dom'

export default ({ type, mapping, ...props }) => {
  let scalarFields = Object.entries(mapping)
    .filter(([, metadata]) => metadata.type && metadata.type !== 'nested')
    .map(([field]) => field)

  console.log('testingyo')

  return (
    <Route>
      {p => (
        <Query
          name="TableQuery"
          variables={{
            filters: JSON.parse(parse(p.location.search).filters),
          }}
          query={`
        query TableQuery($filters: FiltersArgument) {
          ${type} {
            hits(first: 1000 filters: $filters) {
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
            !(data && data[type]) ? null : (
              <div
                style={{
                  width: 'calc(100% - 600px)',
                }}
              >
                <span className="section-title">
                  <span>Results</span>
                </span>
                <span className="showing">
                  <span>2 of {data[type].hits.total.toLocaleString()}</span>
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
                        {scalarFields.map(field => (
                          <th key={field}>{field}</th>
                        ))}
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
      )}
    </Route>
  )
}
