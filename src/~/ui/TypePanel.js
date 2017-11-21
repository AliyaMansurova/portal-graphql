import React from 'react'
import Link from '~/ui/Link'

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

export default TypePanel
