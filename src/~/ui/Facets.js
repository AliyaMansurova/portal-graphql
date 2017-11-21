import React from 'react'
import Query from '~/ui/Query'
import mappingToAggsType from '~/utils/mappingToAggsType'

export default ({ type, mapping }) => (
  <div style={{ width: 400 }}>
    <div style={{ padding: '10px 20px' }}>Facets</div>
    <Query
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
          : Object.entries(
              data.data[type].aggregations,
            ).map(([field, data]) => (
              <div key={field}>
                <div>{field}</div>
              </div>
            ))}
      {/* {data => {
        if (data) {
          console.log(123, data.data[type].aggregations)
        }
        return !data ? 'loading' : JSON.stringify(data.data[type].aggregations)
      }} */}
    </Query>
  </div>
)
