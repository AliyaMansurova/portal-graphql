import React from 'react'
import Aux from './Aux'
import State from './State'
import { Route, Link, Redirect } from 'react-router-dom'
import DataToAggregations from './DataToAggregations'
import Modal from 'react-modal'

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
                    onChange={e =>
                      typeInputState.update({ text: e.target.value })}
                    onKeyPress={async e => {
                      if (e.key === 'Enter') {
                        let r = await fetch(
                          `http://localhost:5050/${props.match.params
                            .name}/type`,
                          {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              type: typeInputState.text,
                            }),
                          },
                        ).then(r => r.json())
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
          <div className="header">{props.match.params.name} data portal</div>
          <div style={{ display: 'flex', height: 'calc(100vh - 50px)' }}>
            <div style={{ width: 200, borderRight: '1px solid #cacaca' }}>
              <div
                style={{ display: 'flex', padding: 10, alignItems: 'center' }}
              >
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
                  <Link to={`${props.match.params.name}/${type}`}>{type}</Link>
                </div>
              ))}
            </div>

            <Route path="/:name/:type" component={DataToAggregations} />
          </div>
        </Aux>
      )}
    </State>
  </Aux>
)
