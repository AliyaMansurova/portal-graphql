import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import '~/ui/App.css'
import Table from '~/ui/Table'
import FacetsPanel from '~/ui/FacetsPanel'
import TypesPanel from '~/ui/TypesPanel'
import Header from '~/ui/Header'
import CurrentFilters from '~/ui/CurrentFilters'

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
          <Header />
          <CurrentFilters />
          <div style={{ display: 'flex' }}>
            <Route>
              {({ location }) => (
                <TypesPanel types={Object.keys(mappings)} location={location} />
              )}
            </Route>
            <Route exact path="/:type">
              {({ match, location }) =>
                match && (
                  <FacetsPanel
                    location={location}
                    type={match.params.type}
                    mapping={mappings[match.params.type].properties}
                  />
                )}
            </Route>
            <Route exact path="/:type">
              {({ match, ...props }) =>
                match && (
                  <Table
                    type={match.params.type}
                    mapping={mappings[match.params.type].properties}
                  />
                )}
            </Route>
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
