import React, { Component } from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import MonacoEditor from 'react-monaco-editor'
import '~/ui/App.css'

import GraphiQL from 'graphiql'
import 'graphiql/graphiql.css'

let API = 'http://localhost:5050'

function graphQLFetcher(graphQLParams) {
  return fetch(API + '/graphql', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graphQLParams),
  }).then(response => response.json())
}
// import Table from '~/ui/Table'
// import FacetsPanel from '~/ui/FacetsPanel'
// import TypesPanel from '~/ui/TypesPanel'
// import Header from '~/ui/Header'
// import CurrentFilters from '~/ui/CurrentFilters'

let Aux = p => p.children

class App extends Component {
  // state = { mappings: null }
  // componentDidMount() {
  //
  //
  //   fetch(API + '/mappings')
  //     .then(r => r.json())
  //     .then(({ mappings }) => this.setState({ mappings }))
  // }
  render() {
    const requireConfig = {
      url:
        'https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.1/require.min.js',
      paths: {
        vs: 'https://www.mycdn.com/monaco-editor/0.6.1/min/vs',
      },
    }
    return (
      <BrowserRouter>
        <Aux>
          <div id="title">portalize</div>
          <div>
            <Link to="mappingsToSchema">mappingsToSchema</Link>
            <Link to="mappingsToSchema">mappingsToSchema</Link>
          </div>
          <Route exact path="mappingsToSchema">
            {() => (
              <Aux>
                <MonacoEditor
                  width="800"
                  height="600"
                  language="javascript"
                  value="// type your code..."
                  requireConfig={requireConfig}
                />
                <GraphiQL fetcher={graphQLFetcher} />
              </Aux>
            )}
          </Route>
        </Aux>
      </BrowserRouter>
    )
  }
}

export default App
