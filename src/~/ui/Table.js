import React from 'react'
import Query from '~/ui/Query'

export default ({ match }) => (
  <div>
    <h1>{match.params.type} list</h1>

    <Query
      query={`
        query {
          ${match.params.type} {
            hits {
              total
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      `}
    >
      {data => JSON.stringify({ data }, null, 2)}
    </Query>
  </div>
)
