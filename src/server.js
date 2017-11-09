import express from 'express'
import bodyParser from 'body-parser'
import { addMockFunctionsToSchema } from 'graphql-tools'
import { graphqlExpress } from 'apollo-server-express'
import fs from 'fs'
import { promisify } from 'util'
import { ES_TYPES } from './constants'
import generateSchema from './schema'

let writeFile = promisify(fs.writeFile)

export default async es => {
  let app = express()

  try {
    // get mappings from es and cache them
    if (es) {
      let types = Object.entries(ES_TYPES)

      let mappings = await Promise.all(
        types.map(([, { index, type }]) =>
          es.indices.getMapping({
            index,
            type,
          }),
        ),
      )

      types.forEach(
        async ([type], i) =>
          await writeFile(
            `src/mappings/${type}.mapping.json`,
            JSON.stringify(Object.values(mappings[i])[0].mappings, null, 2),
          ),
      )
    }

    let schema = await generateSchema()

    if (!es) {
      console.log('⚠️ Running api with mocked responses! ⚠️')
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
