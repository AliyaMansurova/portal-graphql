import React from 'react'
import ReactDOM from 'react-dom'
import App from '~/ui/App'

let API = 'http://localhost:5050'

fetch(API + '/mappings')
  .then(r => r.json())
  .then(({ mappings }) => {
    ReactDOM.render(
      <App mappings={mappings} />,
      document.getElementById('root'),
    )
  })
