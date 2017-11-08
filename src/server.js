import express from 'express'
import bodyParser from 'body-parser'
import { addMockFunctionsToSchema } from 'graphql-tools'
import { graphqlExpress } from 'apollo-server-express'
import generateSchema from './schema'

export default async es => {
  let app = express()

  try {
    let re = await es.indices.getMapping({
      index: process.env.ES_ECASE_INDEX,
      type: process.env.ES_ECASE_TYPE,
    })

    console.log(
      re[process.env.ES_ECASE_INDEX].mappings[process.env.ES_ECASE_TYPE]
        .properties,
    )

    let schema = generateSchema(
      re[process.env.ES_ECASE_INDEX].mappings[process.env.ES_ECASE_TYPE]
        .properties,
    )

    if (!es) {
      console.log('⚠️ Running app with mocked responses! ⚠️')
      addMockFunctionsToSchema({ schema })
    }

    app.use(
      '/graphql',
      bodyParser.json(),
      graphqlExpress({ schema, context: { es } }),
    )

    app.listen(process.env.PORT, () =>
      console.log(`⚡️ Listening on port ${process.env.PORT}`),
    )
  } catch (e) {
    console.warn(e)
  }
}
