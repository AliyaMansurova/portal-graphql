import { Component } from 'react'

let API = 'http://localhost:5050'

let api = ({ name = 'UnnamedQuery', query, variables }) =>
  fetch(API + `/graphql/${name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  }).then(r => r.json())

export default class extends Component {
  state = { data: null }
  componentDidMount() {
    let { query, variables, name } = this.props
    api({ query, variables, name }).then(({ data }) => this.setState({ data }))
  }
  componentWillReceiveProps(next) {
    if (
      JSON.stringify(this.props.query) !== JSON.stringify(next.query) ||
      JSON.stringify(this.props.variables) !== JSON.stringify(next.variables)
    ) {
      let { query, variables, name } = next
      api({ query, variables, name }).then(({ data }) =>
        this.setState({ data }),
      )
    }
  }
  render() {
    return this.props.children(this.state.data)
  }
}
