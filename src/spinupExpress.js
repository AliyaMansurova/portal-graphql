import express from 'express'
import graphqlHTTP from 'express-graphql'
import schema from './schema'

export default () => {
  let app = express()

  app.use(
    '/graphql',
    graphqlHTTP({
      schema,
      graphiql: true,
    }),
  )

  app.listen(process.env.PORT, () =>
    console.log(`⚡️ Listening on port ${process.env.PORT}`),
  )
}
