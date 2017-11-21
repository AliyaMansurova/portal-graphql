import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import '~/ui/App.css'
import Table from '~/ui/Table'
import Facets from '~/ui/Facets'
import TypePanel from '~/ui/TypePanel'

class Item extends Component {
  render() {
    return (
      <div>
        <h1>{this.props.match.params.type} list</h1>
      </div>
    )
  }
}

class App extends Component {
  state = { mappings: null }
  componentDidMount() {
    let API = 'http://localhost:5050'

    fetch(API + '/mappings')
      .then(r => r.json())
      .then(({ mappings }) => this.setState({ mappings }))
  }
  render() {
    let { mappings } = this.state
    return !mappings ? (
      'loading'
    ) : (
      <BrowserRouter>
        <div>
          <div className="header z1">DATA PORTAL</div>
          <div style={{ display: 'flex' }}>
            <TypePanel types={Object.keys(mappings)} />
            <Route
              exact
              path="/:type"
              component={props => (
                <Facets
                  type={props.match.params.type}
                  mapping={mappings[props.match.params.type].properties}
                />
              )}
            />
            <Route
              exact
              path="/:type"
              component={props => <Table {...props} />}
            />
          </div>
          <Route
            path="/:type/:id"
            component={props => (
              <div>
                <Item {...props} />
                <hr />
                {JSON.stringify(props, null, 2)}
              </div>
            )}
          />
        </div>
      </BrowserRouter>
    )
  }
}

export default App
