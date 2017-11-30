import React from 'react'
import Aux from './Aux'
import State from './State'
import { Route, Link, Redirect } from 'react-router-dom'
import DataToAggregations from './DataToAggregations'
import AddTypeModal from './AddTypeModal'
import TypesPanel from './TypesPanel'

export default props => (
  <Aux>
    <State
      initial={{
        types: [],
        addingType: false,
      }}
      async={() =>
        fetch(`http://localhost:5050/${props.match.params.name}/type`)
          .then(r => r.json())
          .then(r => {
            return {
              types: r.error ? [] : r.hits.map(x => x._source.name),
            }
          })}
    >
      {typesState => (
        <Aux>
          <AddTypeModal
            typesState={typesState}
            name={props.match.params.name}
          />
          <div className="header">{props.match.params.name} data portal</div>
          <div style={{ display: 'flex', height: 'calc(100vh - 50px)' }}>
            <TypesPanel
              typesState={typesState}
              name={props.match.params.name}
            />

            <Route path="/:name/:type" component={DataToAggregations} />
          </div>
        </Aux>
      )}
    </State>
  </Aux>
)
