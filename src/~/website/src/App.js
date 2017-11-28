import React, { Component } from 'react'
import { BrowserRouter, Route, NavLink, Redirect } from 'react-router-dom'
import './App.css'
import MappingsToSchema from './MappingsToSchema'
import MappingsToAggregations from './MappingsToAggregations'
import DataToAggregations from './DataToAggregations'
import Splash from './Splash'
import Aux from './Aux'
import State from './State'
import Dashboard from './Dashboard'

let Nav = () => (
  <div className="nav">
    <NavLink to="/mappingsToSchema" activeClassName="active">
      mappingsToSchema
    </NavLink>
    <NavLink to="/mappingsToAggregations" activeClassName="active">
      mappingsToAggregations
    </NavLink>
    <NavLink to="/dataToAggregations" activeClassName="active">
      dataToAggregations
    </NavLink>
  </div>
)

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Aux>
          {/* <div className="header">arranger</div> */}
          <Route exact path="/" component={Splash} />
          <Route path="/:name" component={Dashboard} />
          {/* <Route path="/mappingsToSchema" component={MappingsToSchema} />
          <Route
            path="/mappingsToAggregations"
            component={MappingsToAggregations}
          />
           */}
        </Aux>
      </BrowserRouter>
    )
  }
}

export default App
