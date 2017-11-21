import React from 'react'
import Link from '~/ui/Link'

let TypePanel = ({ types, location }) => (
  <div style={{ minWidth: 200 }} className="z1">
    <div className="section-title">
      <span>Types</span>
    </div>
    {types.map(type => (
      <div
        key={type}
        className={`type-link ${location.pathname.includes(type) && 'active'}`}
      >
        <Link to={'/' + type}>{type}</Link>
      </div>
    ))}
  </div>
)

export default TypePanel
