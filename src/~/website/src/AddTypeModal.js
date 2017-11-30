import React from 'react'
import Modal from 'react-modal'
import State from './State'
import Aux from './Aux'

export default ({ typesState, name }) => (
  <Modal
    isOpen={typesState.addingType}
    onAfterOpen={() => {}}
    onRequestClose={() => {}}
    closeTimeoutMS={100}
    style={{
      content: {
        position: 'absolute',
        top: '240px',
        left: '140px',
        right: '140px',
        bottom: '240px',
        border: '1px solid #ccc',
        background: '#fff',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '4px',
        outline: 'none',
        padding: '20px',
      },
    }}
    contentLabel="Modal"
  >
    <h1>Add New Type</h1>
    <State
      initial={{
        text: '',
        go: false,
      }}
    >
      {typeInputState => (
        <Aux>
          <input
            autoFocus
            value={typeInputState.text}
            type="text"
            placeholder="ex: user"
            onChange={e => typeInputState.update({ text: e.target.value })}
            onKeyPress={async e => {
              if (e.key === 'Enter') {
                let r = await fetch(`http://localhost:5050/${name}/type`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    type: typeInputState.text,
                  }),
                }).then(r => r.json())
                if (!r.error) {
                  typesState.update({
                    types: [...typesState.types, typeInputState.text],
                    addingType: false,
                  })
                  typeInputState.update({ text: '' })
                }
              }
            }}
          />
          {/* {typeInputState.go && (
          <Redirect
            to={`${props.match.params.name}/${typeInputState.text}`}
          />
        )} */}
        </Aux>
      )}
    </State>
  </Modal>
)
