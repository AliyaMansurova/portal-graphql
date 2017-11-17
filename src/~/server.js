import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { addMockFunctionsToSchema } from 'graphql-tools'
import { graphqlExpress } from 'apollo-server-express'
import chalk from 'chalk'
import { rainbow } from 'chalk-animation'
import makeSchema from '~/schema'
import { writeFile, readFile, mappingFolder } from '~/utils'

export default async es => {
  let types = Object.entries(global.config.ES_TYPES)
  let app = express()

  try {
    // get mappings from es and cache them
    if (es && process.env.CACHE_MAPPINGS) {
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
            mappingFolder(type),
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
      addMockFunctionsToSchema({
        schema,
        mocks: { JSON: () => JSON.stringify({ key: 'value' }) },
      })
    }

    app.use(cors())

    app.get('/mappings', async (req, res) => {
      let mappings = await Promise.all(
        types.map(([, { es_type }], i) =>
          readFile(mappingFolder(es_type), {
            encodpng: 'utf8',
          }),
        ),
      )
      res.json({
        mappings: mappings.map(d => JSON.parse(d)).reduce((acc, item) => {
          let [[type, mapping]] = Object.entries(item)
          return {
            ...acc,
            [type]: mapping,
          }
        }, {}),
      })
    })

    app.use(
      ['/graphql', '/graphql/:query'],
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
