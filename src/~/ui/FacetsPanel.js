import React, { Component } from 'react'
import Query from '~/ui/Query'
import mappingToAggsType from '~/utils/mappingToAggsType'
import Link from '~/ui/Link'
import { parse, stringify } from 'query-string'
import TermAgg from './TermAgg'

class FacetsPanel extends Component {
  state = { mode: 'add', search: '' }
  render() {
    let { search } = this.state
    let { type, location } = this.props

    let mappings = mappingToAggsType(this.props.mapping)

    let aggs = mappings.map(field => field.split(':').map(x => x.trim()))

    let activeFacets = []
      .concat(parse(location.search)[type + 'fc'])
      .filter(Boolean)

    return (
      <div
        style={{
          minWidth: 400,
          display: 'flex',
          flexDirection: 'column',
        }}
        className="z1"
      >
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

        <input
          className="facet-search"
          placeholder="Search..."
          onChange={e => this.setState({ search: e.target.value })}
        />

        {this.state.mode === 'add' && (
          <div className="remainder">
            {aggs
              .filter(([field]) => (search ? field.includes(search) : true))
              .map(([field]) => {
                let facets = activeFacets.includes(field)
                  ? activeFacets.filter(f => f !== field)
                  : activeFacets.concat(field)

                return (
                  <Link
                    key={field}
                    to={{
                      search: stringify({
                        [type + 'fc']: facets,
                      }),
                    }}
                  >
                    <div
                      className={`facet add-facet ${activeFacets.includes(field)
                        ? 'active'
                        : ''}`}
                    >
                      <div>{field.replace(/__/g, '.')}</div>
                    </div>
                  </Link>
                )
              })}
          </div>
        )}
        {this.state.mode === 'select' &&
          !!activeFacets.length && (
            <Query
              name="FacetQuery"
              query={`
                query {
                  ${type} {
                    aggregations {
                      ${mappings
                        .filter(field => {
                          let [name] = field.split(':').map(x => x.trim())
                          return activeFacets.includes(name)
                        })
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
                !data ? (
                  'loading'
                ) : (
                  <div className="remainder">
                    {Object.entries(
                      data[type].aggregations,
                    ).map(([field, data]) => (
                      <div key={field}>
                        <TermAgg field={field} buckets={data.buckets} />
                      </div>
                    ))}
                  </div>
                )}
            </Query>
          )}
      </div>
    )
  }
}

export default FacetsPanel
