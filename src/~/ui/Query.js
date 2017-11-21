import { Component } from 'react'

let API = 'http://localhost:5050'

let api = ({ query, variables }) =>
  fetch(API + '/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  }).then(r => r.json())

export default class extends Component {
  state = { data: null }
  componentDidMount() {
    let { query, variables } = this.props
    api({ query, variables }).then(data => this.setState({ data }))
  }
  componentWillReceiveProps(next) {
    if (JSON.stringify(this.props.query) !== JSON.stringify(next.query)) {
      let { query, variables } = next
      api({ query, variables }).then(data => this.setState({ data }))
    }
  }
  render() {
    return this.props.children(this.state.data)
  }
}
