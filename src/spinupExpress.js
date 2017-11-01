import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress } from 'apollo-server-express'
import schema from './schema'

export default es => {
  let app = express()

  app.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress({ schema, context: { es } }),
  )

  app.listen(process.env.PORT, () =>
    console.log(`⚡️ Listening on port ${process.env.PORT}`),
  )
}
