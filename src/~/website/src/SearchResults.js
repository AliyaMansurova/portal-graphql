import React from 'react'
import Query from './Query'
import Location from './Location'

export default ({ aggs, ep, type }) => (
  <div className="search-results">
    {aggs.filter(agg => agg.type === type).map(agg => (
      <Location key={agg.type}>
        {p => (
          <Query
            endpoint={ep}
            name="TableQuery"
            variables={{
              filters: p.filters,
            }}
            query={`
query TableQuery($filters: FiltersArgument) {
${type} {
hits(first: 1000 filters: $filters) {
total
edges {
  node {
    id
    ${agg.scalarFields}
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
                    width: 500,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      padding: 10,
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 15,
                        color: '#537979',
                      }}
                    >
                      <span>Showing</span>{' '}
                      <span>
                        {data[type].hits.edges.length} of{' '}
                        {data[type].hits.total.toLocaleString()}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      overflowX: 'auto',
                      height: 'calc(100vh - 50px)',
                      overflow: 'auto',
                      padding: '0 10px',
                    }}
                  >
                    <table className="pure-table smaller pure-table-bordered">
                      <thead>
                        <tr>
                          <th>uuid</th>
                          {agg.scalarFields.map(field => (
                            <th key={field}>{field}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data[type].hits.edges.map(({ node }) => (
                          <tr key={node.id}>
                            <td>
                              <span className="id-field">{node.id}</span>
                            </td>
                            {agg.scalarFields.map(field => (
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
      </Location>
    ))}
  </div>
)
