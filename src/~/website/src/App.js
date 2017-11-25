import React, { Component } from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import MonacoEditor from 'react-monaco-editor'
import { debounce } from 'lodash'
import GraphiQL from 'graphiql'
import 'graphiql/graphiql.css'
import './App.css'

let API = 'http://localhost:5050'

let graphQLFetcher = ep => graphQLParams => {
  console.log(3333, API + `/${ep}`)
  return fetch(API + `/${ep}`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graphQLParams),
  }).then(response => response.json())
}

class App extends Component {
  state = {
    code: 'test',
    valid: false,
    loading: true,
    mappings: JSON.stringify(
      {
        case: {
          properties: {
            case_id: {
              type: 'keyword',
            },
            test: {
              type: 'float',
            },
          },
        },
      },
      null,
      2,
    ),
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

    return (
      <BrowserRouter>
        <div>
          <div className="header">arranger</div>
          <div className="nav">
            <Link to="mappingsToSchema">mappingsToSchema</Link>
            <Link to="mappingToAggregations">mappingToAggregations</Link>
          </div>
          <div
            style={{
              display: 'flex',
              height: 'calc(100vh - 100px)',
              overflow: 'hidden',
            }}
          >
            <MonacoEditor
              language="json"
              // value={this.state.code}
              value={this.state.mappings}
              options={options}
              onChange={this.onChange}
              editorDidMount={this.editorDidMount}
            />
            {!this.state.valid &&
              !this.state.loading && (
                <div style={{ width: '350px', padding: 20 }}>
                  Invalid mapping.
                </div>
              )}
            {this.state.loading && (
              <div style={{ width: '350px', padding: 20 }}>Loading.</div>
            )}
            {this.state.valid &&
              !this.state.loading && (
                <GraphiQL fetcher={graphQLFetcher(this.state.ep)} />
              )}
          </div>
        </div>
      </BrowserRouter>
    )
  }
}

export default App
