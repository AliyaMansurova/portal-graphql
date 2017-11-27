import React, { Component } from 'react'
import { BrowserRouter, Route, NavLink } from 'react-router-dom'
import './App.css'
import MappingsToSchema from './MappingsToSchema'
import MappingsToAggregations from './MappingsToAggregations'
import DataToAggregations from './DataToAggregations'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <div className="header">arranger</div>
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
          <Route exact path="/" component={() => <div>home</div>} />
          <Route path="/mappingsToSchema" component={MappingsToSchema} />
          <Route
            path="/mappingsToAggregations"
            component={MappingsToAggregations}
          />
          <Route path="/dataToAggregations" component={DataToAggregations} />
        </div>
      </BrowserRouter>
    )
  }
}

export default App
