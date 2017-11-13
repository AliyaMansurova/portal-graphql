import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { addMockFunctionsToSchema } from 'graphql-tools'
import { graphqlExpress } from 'apollo-server-express'
import fs from 'fs'
import { promisify } from 'util'
import chalk from 'chalk'
import { rainbow } from 'chalk-animation'
import { ES_TYPES } from '~/constants'
import makeSchema from '~/schema'

let writeFile = promisify(fs.writeFile)

export default async es => {
  let app = express()

  try {
    // get mappings from es and cache them
    if (es && process.env.CACHE_MAPPINGS) {
      let types = Object.entries(ES_TYPES)

      let mappings = await Promise.all(
        types.map(([, { index, es_type }]) =>
          es.indices.getMapping({
            index,
            type: es_type,
          }),
        ),
      )

      console.log(chalk`✏️ {cyan writing mappings to disk} ✏️`)

      types.forEach(
        async ([type], i) =>
          await writeFile(
            `src/~/mappings/${type}.mapping.json`,
            JSON.stringify(Object.values(mappings[i])[0].mappings, null, 2),
          ),
      )
    }

    // schema is made from cached mapping files
    let schema = await makeSchema()

    if (!es) {
      console.log(
        chalk`⚠️ {keyword('orange') Running api with mocked responses!} ⚠️`,
      )
      addMockFunctionsToSchema({ schema })
    }

    app.use(cors())

    app.use(
      '/graphql',
      bodyParser.json(),
      graphqlExpress({ schema, context: { es } }),
    )

    app.listen(process.env.PORT, () =>
      rainbow(`⚡️ Listening on port ${process.env.PORT} ⚡️`),
    )
  } catch (e) {
    console.warn(e)
  }
}
