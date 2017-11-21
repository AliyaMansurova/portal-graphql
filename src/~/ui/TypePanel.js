import React from 'react'
import Link from '~/ui/Link'

let TypePanel = ({ types }) => (
  <div style={{ minWidth: 200 }}>
    <div className="section-title">
      <span>Types</span>
    </div>
    {types.map(type => (
      <div key={type} style={{ padding: '10px 20px' }}>
        <Link to={'/' + type}>{type}</Link>
      </div>
    ))}
  </div>
)

export default TypePanel
