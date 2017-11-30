import React from 'react'
import Query from './Query'
import TermAgg from './TermAgg'

export default ({ agg, ep }) => (
  <Query
    key={agg.type}
    endpoint={ep}
    name="FacetQuery"
    query={`
    query {
      ${agg.type} {
        aggregations {
          ${agg.mapping
            // .filter(field => {
            //   let [name] = field.split(':').map(x => x.trim())
            //   return activeFacets.includes(name)
            // })
            .map(([name, type]) => {
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
      !data ? (
        'loading'
      ) : (
        <div className="remainder">
          {Object.entries(data[agg.type].aggregations).map(([field, data]) => (
            <div key={field}>
              <TermAgg
                field={field}
                buckets={data.buckets}
                handleFieldClick={d => {
                  console.log(123, d)
                }}
              />
            </div>
          ))}
        </div>
      )}
  </Query>
)
