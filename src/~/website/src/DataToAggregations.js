import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import MonacoEditor from './MonacoEditor'
import { debounce } from 'lodash'
import './App.css'
import mappingToAggsType from './mapaggs'
import AggsPanel from './AggsPanel'
import Query from './Query'
import SearchResults from './SearchResults'
import CurrentFilters from './CurrentFilters'

let API = 'http://localhost:5050'

let initData = []

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
  async componentDidMount() {
    this.getmaps = debounce(this.getmaps, 500)
    let r = await fetch(
      API +
        `/${this.props.match.params.name}_${this.props.match.params.type}/${this
          .props.match.params.type}`,
    ).then(r => r.json())

    if (!r.error) {
      this.setState(
        { data: JSON.stringify(r.hits.map(x => x._source), null, 2) },
        () => this.onChange(this.state.data),
      )
    }
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
  getmaps = docs => {
    fetch(API + '/dataToAggregations', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project: this.props.match.params.name,
        type: this.props.match.params.type,
        docs,
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

    let { mappings, data } = this.state
    let { type, location } = this.props

    let aggs

    if (this.state.valid) {
      aggs = Object.entries(mappings).map(([key, type]) => {
        return {
          type: key,
          mapping: mappingToAggsType(type.properties).map(field =>
            field.split(':').map(x => x.trim()),
          ),
          scalarFields: Object.entries(type.properties)
            .filter(
              ([, metadata]) => metadata.type && metadata.type !== 'nested',
            )
            .map(([field]) => field),
        }
      })
    }

    let d

    try {
      d = JSON.parse(data)
    } catch (e) {}

    return (
      <div
        style={{
          display: 'flex',
          height: 'calc(100vh - 50px)',
          overflow: 'hidden',
        }}
      >
        <div style={{ width: 450 }}>
          <div style={{ display: 'flex', padding: 10, alignItems: 'center' }}>
            <span
              style={{
                fontSize: 15,
                color: '#537979',
              }}
            >
              DOCUMENTS
            </span>
          </div>
          <MonacoEditor
            requireConfig={{ url: '/vs/loader.js' }}
            language="json"
            value={data}
            options={options}
            onChange={this.onChange}
            editorDidMount={this.editorDidMount}
          />
        </div>
        {!this.state.valid &&
          !this.state.loading &&
          !d && <div style={{ width: 700, padding: 20 }}>Invalid mapping.</div>}
        {!this.state.loading &&
          d &&
          !d.length && (
            <div style={{ width: 700, padding: 20 }}>No documents.</div>
          )}
        {this.state.loading && (
          <div style={{ width: 700, padding: 20 }}>Loading.</div>
        )}
        {this.state.valid &&
          !this.state.loading && (
            <div className="aggs-config" style={{ width: 220 }}>
              <div
                style={{ display: 'flex', padding: 10, alignItems: 'center' }}
              >
                <span
                  style={{
                    fontSize: 15,
                    color: '#537979',
                  }}
                >
                  FACET CONFIG
                </span>
              </div>
              {aggs
                .filter(agg => agg.type === this.props.match.params.type)
                .map(agg =>
                  agg.mapping.map(([field]) => {
                    return (
                      <div key={field} className="config-field">
                        <div>
                          <span className="config-field-label">
                            FIELD:
                          </span>{' '}
                          <span>{field.replace(/__/g, '.')}</span>
                        </div>
                        <div>
                          <span className="config-field-label">
                            DISPLAY NAME:
                          </span>{' '}
                          <span>{field.replace(/__/g, '.')}</span>
                        </div>
                      </div>
                    )
                  }),
                )}
            </div>
          )}
        {this.state.valid &&
          !this.state.loading && (
            <div className="results">
              <div
                style={{ display: 'flex', padding: 10, alignItems: 'center' }}
              >
                <span
                  style={{
                    fontSize: 15,
                    color: '#537979',
                  }}
                >
                  FILTERS: <CurrentFilters history={this.props.history} />{' '}
                </span>
              </div>
              <div style={{ display: 'flex' }}>
                <div className="aggs" style={{ width: 250 }}>
                  {aggs
                    .filter(agg => agg.type === this.props.match.params.type)
                    .map(agg => (
                      <AggsPanel
                        key={agg.type}
                        agg={agg}
                        ep={this.state.ep}
                        history={this.props.history}
                      />
                    ))}
                </div>
                <SearchResults
                  aggs={aggs}
                  ep={this.state.ep}
                  type={this.props.match.params.type}
                />
              </div>
            </div>
          )}
      </div>
    )
  }
}

export default App
