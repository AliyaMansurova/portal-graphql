import React, { Component } from 'react'
import { BrowserRouter, Route, NavLink } from 'react-router-dom'
import './App.css'
import MappingsToSchema from './MappingsToSchema'

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
            <NavLink to="/mappingToAggregations" activeClassName="active">
              mappingToAggregations
            </NavLink>
          </div>
          <Route exact path="/" component={() => <div>home</div>} />
          <Route path="/mappingsToSchema" component={MappingsToSchema} />
        </div>
      </BrowserRouter>
    )
  }
}

export default App
