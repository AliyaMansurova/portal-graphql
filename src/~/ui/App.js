import React, { Component } from 'react'
import { BrowserRouter, Link, Route } from 'react-router-dom'
import '~/ui/App.css'
import Table from '~/ui/Table'
import Query from '~/ui/Query'
import Facets from '~/ui/Facets'

class Item extends Component {
  render() {
    return (
      <div>
        <h1>{this.props.match.params.type} list</h1>
      </div>
    )
  }
}

let TypePanel = ({ types }) => (
  <div style={{ width: 200 }}>
    <div style={{ padding: '10px 20px' }}>Types</div>
    {types.map(type => (
      <div key={type} style={{ padding: '10px 20px' }}>
        <Link to={'/' + type}>{type}</Link>
      </div>
    ))}
  </div>
)

class App extends Component {
  // componentDidMount() {
  //   let aggs = mappingToAggsType(this.props.mappings.cases.properties)
  //   console.log(123, aggs)
  // }
  render() {
    return (
      <BrowserRouter>
        <div>
          <div className="header z1">DATA PORTAL</div>
          <div style={{ display: 'flex' }}>
            <TypePanel types={Object.keys(this.props.mappings)} />
            <Route
              exact
              path="/:type"
              component={props => (
                <Facets
                  type={props.match.params.type}
                  mapping={
                    this.props.mappings[props.match.params.type].properties
                  }
                />
              )}
            />
            <Route
              exact
              path="/:type"
              component={props => (
                <div>
                  <Table {...props} />
                  <hr />
                  {JSON.stringify(props, null, 2)}
                </div>
              )}
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
