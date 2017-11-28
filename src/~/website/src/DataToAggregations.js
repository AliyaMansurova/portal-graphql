import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import MonacoEditor from './MonacoEditor'
import { debounce } from 'lodash'
import './App.css'
import mappingToAggsType from './mapaggs'
import Query from './Query'
import TermAgg from './TermAgg'

let API = 'http://localhost:5050'

let exampleInit = {
  user: [
    {
      name: 'Alex',
      favorite_movies: [
        {
          title: 'Memento',
          rating: 5,
        },
        {
          title: 'Fight Club',
          rating: 4,
        },
      ],
    },
    {
      name: 'Chris',
      favorite_movies: [
        {
          title: 'Memento',
          rating: 4,
        },
        {
          title: 'Superman',
          rating: 3,
        },
      ],
    },
  ],
  movie: [
    {
      title: 'Memento',
    },
    {
      title: 'Fight Club',
    },
  ],
}

let initData = [
  {
    name: 'Chris',
    favorite_movies: [
      {
        title: 'Memento',
        rating: 4,
      },
      {
        title: 'Superman',
        rating: 3,
      },
    ],
  },
]

class App extends Component {
  state = {
    code: 'test',
    valid: false,
    loading: true,
    // mappings: JSON.stringify(mappings, null, 2),
    mappings: null,
    //     data: `// start by adding a thing
    //
    // ${JSON.stringify(initData, null, 2)}
    // `,
    data: JSON.stringify(initData, null, 2),
  }
  componentDidMount() {
    // this.dmap = debounce(this.map2S, 300)
    this.onChange(this.state.data)
  }
  onChange = (newValue, e) => {
    let data
    let valid
    try {
      data = JSON.parse(newValue)
      valid = true
    } catch (e) {
      valid = false
    }
    if (valid) {
      this.setState({ loading: true })
      this.getmaps(data)
    } else {
      this.setState({ valid: false })
    }
    this.setState({ data: newValue })
  }
  // onChangeData = (newValue, e) => {
  //   let mappings
  //   let valid
  //   try {
  //     mappings = JSON.parse(newValue)
  //     valid = true
  //   } catch (e) {
  //     valid = false
  //   }
  //   if (valid) {
  //     this.setState({ loading: true })
  //     this.dmap(mappings)
  //   } else {
  //     this.setState({ valid: false })
  //   }
  //   this.setState({ mappings: newValue })
  // }
  getmaps = data => {
    fetch(API + '/dataToAggregations', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data,
      }),
    })
      .then(r => r.json())
      .then(d => {
        setTimeout(() => {
          this.setState({
            ep: d.ep,
            valid: d.valid,
            loading: false,
            mappings: d.mappings,
          })
        }, 1000) // wait for indexer to finish
      })
  }
  render() {
    const options = {
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: false,
      cursorStyle: 'line',
      automaticLayout: false,
      minimap: {
        enabled: false,
      },
    }

    let { mappings } = this.state
    let { type, location } = this.props

    let aggs

    if (this.state.valid) {
      aggs = Object.entries(mappings).map(([key, type]) => {
        return {
          type: key,
          mapping: mappingToAggsType(type.properties).map(field =>
            field.split(':').map(x => x.trim()),
          ),
        }
      })
    }

    return (
      <div
        style={{
          display: 'flex',
          height: 'calc(100vh - 100px)',
          overflow: 'hidden',
        }}
      >
        <MonacoEditor
          requireConfig={{ url: '/vs/loader.js' }}
          language="json"
          value={this.state.data}
          options={options}
          onChange={this.onChange}
          editorDidMount={this.editorDidMount}
        />
        {/* <div>
          <MonacoEditor
            language="json"
            value={this.state.mappings}
            options={options}
            onChange={this.onChange}
            editorDidMount={this.editorDidMount}
          />
        </div>
        <div>
          <MonacoEditor
            language="json"
            value={this.state.mappings}
            options={options}
            onChange={this.onChange}
            editorDidMount={this.editorDidMount}
          />
        </div> */}
        {!this.state.valid &&
          !this.state.loading && (
            <div style={{ width: 700, padding: 20 }}>Invalid mapping.</div>
          )}
        {this.state.loading && (
          <div style={{ width: 700, padding: 20 }}>Loading.</div>
        )}
        {this.state.valid &&
          !this.state.loading && (
            <div className="aggs-config" style={{ width: 700 }}>
              <div>Aggregation Configuration</div>
              <hr />
              {aggs.map(agg => (
                <div key={agg.type}>
                  <div>
                    <b>{agg.type}</b>
                  </div>
                  {agg.mapping.map(([field]) => {
                    return (
                      <div key={field}>
                        <div>{field.replace(/__/g, '.')}</div>
                      </div>
                    )
                  })}
                  <hr />
                </div>
              ))}
            </div>
          )}
        <div className="aggs-config" style={{ width: 700 }}>
          {this.state.valid &&
            !this.state.loading &&
            aggs.map(agg => (
              <Query
                endpoint={this.state.ep}
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
                      {Object.entries(
                        data[agg.type].aggregations,
                      ).map(([field, data]) => (
                        <div key={field}>
                          <TermAgg field={field} buckets={data.buckets} />
                        </div>
                      ))}
                    </div>
                  )}
              </Query>
            ))}
        </div>
      </div>
    )
  }
}

export default App
