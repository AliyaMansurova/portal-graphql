import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import MonacoEditor from 'react-monaco-editor'
import { debounce } from 'lodash'
import './App.css'
import mappingToAggsType from './mapaggs'

let API = 'http://localhost:5050'

let user = {
  properties: {
    name: {
      type: 'keyword',
    },
    favorite_movies: {
      type: 'nested',
      properties: {
        title: {
          type: 'keyword',
        },
        rating: {
          type: 'integer',
        },
      },
    },
  },
}

let movies = {
  properties: {
    name: {
      type: 'keyword',
    },
    first_release: {
      type: 'keyword',
    },
  },
}

let mappings = { user, movies }

class App extends Component {
  state = {
    code: 'test',
    valid: false,
    loading: true,
    mappings: JSON.stringify(mappings, null, 2),
  }
  componentDidMount() {
    this.dmap = debounce(this.map2S, 300)
    this.onChange(this.state.mappings)
  }
  onChange = (newValue, e) => {
    let mappings
    let valid
    try {
      mappings = JSON.parse(newValue)
      valid = true
    } catch (e) {
      valid = false
    }
    if (valid) {
      this.setState({ loading: true })
      this.dmap(mappings)
    } else {
      this.setState({ valid: false })
    }
    this.setState({ mappings: newValue })
  }
  onChangeData = (newValue, e) => {
    let mappings
    let valid
    try {
      mappings = JSON.parse(newValue)
      valid = true
    } catch (e) {
      valid = false
    }
    if (valid) {
      this.setState({ loading: true })
      this.dmap(mappings)
    } else {
      this.setState({ valid: false })
    }
    this.setState({ mappings: newValue })
  }
  map2S = mappings => {
    console.log(1111, mappings)
    fetch(API + '/mappingsToSchema', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mappings,
      }),
    })
      .then(r => r.json())
      .then(d => {
        this.setState({ ep: d.ep, valid: d.valid, loading: false })
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
      mappings = JSON.parse(mappings)

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
          language="json"
          value={this.state.mappings}
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
            <div style={{ width: '350px', padding: 20 }}>Invalid mapping.</div>
          )}
        {this.state.loading && (
          <div style={{ width: '350px', padding: 20 }}>Loading.</div>
        )}
        {this.state.valid &&
          !this.state.loading && (
            <div className="aggs-config" style={{ width: 350 }}>
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
      </div>
    )
  }
}

export default App
