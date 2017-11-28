import React from 'react'
import { Redirect } from 'react-router-dom'
import State from './State'
import Aux from './Aux'

export default () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      flexDirection: 'column',
      backgroundColor: 'rgb(40, 139, 156)',
    }}
  >
    <div
      style={{
        fontSize: 45,
        letterSpacing: 7,
        fontFamily: `'Quicksand', sans-serif`,
        color: 'white',
      }}
    >
      ARRANGER
    </div>
    <br />
    <div
      style={{
        fontSize: 24,
        color: 'white',
        fontFamily: `'Quicksand', sans-serif`,
      }}
    >
      Create a data portal generated from{' '}
      <b>
        <em>your data</em>
      </b>.
    </div>
    <br />
    <br />
    <State
      initial={{
        text: '',
        go: false,
      }}
    >
      {state => (
        <Aux>
          <input
            autoFocus
            className="splash-input"
            type="text"
            style={{
              width: 400,
              textAlign: 'center',
              background: 'transparent',
              border: '2px solid white',
              borderRadius: 20,
              padding: 10,
              fontSize: 16,
              outline: 'none',
              color: 'white',
            }}
            placeholder="What's the name of your portal?"
            value={state.text}
            onChange={e => state.update({ text: e.target.value })}
            onKeyPress={e => {
              if (e.key === 'Enter') state.update({ go: true })
            }}
          />
          {state.text && state.go && <Redirect to={state.text} />}
        </Aux>
      )}
    </State>
  </div>
)
