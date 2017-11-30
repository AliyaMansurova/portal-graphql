import React from 'react'
import { Link } from 'react-router-dom'

export default ({ typesState, name }) => (
  <div style={{ width: 170, borderRight: '1px solid #cacaca' }}>
    <div style={{ display: 'flex', padding: 10, alignItems: 'center' }}>
      <span
        style={{
          fontSize: 15,
          color: '#537979',
        }}
      >
        TYPES
      </span>
      <button
        onClick={() => typesState.update({ addingType: true })}
        style={{ outline: 'none', marginLeft: 8, cursor: 'pointer' }}
      >
        +
      </button>
    </div>

    {typesState.types.map(type => (
      <div key={type} style={{ lineHeight: 2, paddingLeft: 10 }}>
        <Link to={`${name}/${type}`}>{type}</Link>
      </div>
    ))}
  </div>
)
