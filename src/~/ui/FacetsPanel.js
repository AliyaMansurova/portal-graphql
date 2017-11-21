import React, { Component } from 'react'
import Query from '~/ui/Query'
import mappingToAggsType from '~/utils/mappingToAggsType'
import Link from '~/ui/Link'
import { parse, stringify } from 'query-string'

class FacetsPanel extends Component {
  state = { mode: 'add' }
  render() {
    let { type, mapping, location } = this.props
    let aggs = mappingToAggsType(mapping).map(field =>
      field.split(':').map(x => x.trim()),
    )

    let activeFacets = parse(location.search)[type + 'fc'] || []

    return (
      <div style={{ minWidth: 400 }} className="z1">
        <div style={{ display: 'flex' }}>
          <div className="section-title">
            <span>Facets</span>
          </div>
          <div className="facet-actions" style={{ lineHeight: '45px' }}>
            <span
              className={this.state.mode === 'add' ? 'active' : ''}
              onClick={() => this.setState({ mode: 'add' })}
            >
              ADD
            </span>
            <span
              className={this.state.mode === 'select' ? 'active' : ''}
              onClick={() => this.setState({ mode: 'select' })}
            >
              SELECT
            </span>
          </div>
        </div>

        {this.state.mode == 'add' && <input className="inputs" />}

        <div className="remainder">
          {aggs.map(([field]) => (
            <Link
              key={field}
              className={`add-facet ${activeFacets.includes(field)
                ? 'active'
                : ''}`}
              to={{
                search: stringify({
                  [type + 'fc']: [
                    field,
                    ...(activeFacets.includes(field)
                      ? activeFacets.filter(active => active !== field)
                      : [...activeFacets, field]),
                  ],
                }),
              }}
            >
              <div className="facet">
                <div>{field.replace(/__/g, '.')}</div>
              </div>
            </Link>
          ))}
        </div>
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
                : Object.entries(
                    data[type].aggregations,
                  ).map(([field, data]) => (
                    <div className="facet" key={field}>
                      <div>{field}</div>
                    </div>
                  ))}
          </Query>
        )}
      </div>
    )
  }
}

export default FacetsPanel
