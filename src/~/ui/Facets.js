import React from 'react'
import Query from '~/ui/Query'
import mappingToAggsType from '~/utils/mappingToAggsType'

export default ({ type, mapping }) => {
  let aggs = mappingToAggsType(mapping).map(field =>
    field.split(':').map(x => x.trim()),
  )

  return (
    <div style={{ width: 400 }}>
      <div style={{ padding: '10px 20px' }}>Facets</div>
      {aggs.map(([field]) => (
        <div key={field}>
          <div>{field.replace(/__/g, '.')}</div>
        </div>
      ))}
      {false && (
        <Query
          name="FacetQuery"
          query={`
            query {
              ${type} {
                aggregations {
                  ${mappingToAggsType(mapping)
                    .slice(0, 20)
                    .map(field => {
                      let [name, type] = field.split(':').map(x => x.trim())
                      return type === 'Aggregations'
                        ? `
                          ${name} {
                            buckets {
                              doc_count
                              key
                            }
                          }
                        `
                        : `
                        ${name} {
                          stats {
                            max
                            min
                            count
                            avg
                            sum
                          }
                          histogram(interval: 1.0) {
                            buckets {
                              doc_count
                              key
                            }
                          }
                        }
                        `
                    })}
                }
              }
            }
          `}
        >
          {data =>
            !data
              ? 'loading'
              : Object.entries(data[type].aggregations).map(([field, data]) => (
                  <div key={field}>
                    <div>{field}</div>
                  </div>
                ))}
        </Query>
      )}
    </div>
  )
}
