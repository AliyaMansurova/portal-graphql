import React from 'react'

class State extends React.Component {
  constructor(props) {
    super(props)
    this.state = props.initial
  }
  update = object => this.setState(state => ({ ...state, ...object }))
  render() {
    return this.props.children({ ...this.state, update: this.update })
  }
}

export default State
