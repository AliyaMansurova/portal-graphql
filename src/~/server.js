import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { capitalize, flattenDeep } from 'lodash'
import { addMockFunctionsToSchema } from 'graphql-tools'
import { graphqlExpress } from 'apollo-server-express'
import chalk from 'chalk'
import { rainbow } from 'chalk-animation'
import makeSchema from '~/schema'
import { writeFile, readFile, mappingFolder, getNestedFields } from '~/utils'

export default async es => {
  let types = Object.entries(global.config.ES_TYPES)
  let app = express()
  let mappings

  try {
    // get mappings from es and cache them
    if (es && process.env.CACHE_MAPPINGS) {
      mappings = await Promise.all(
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

    // TODO: get mappings from cache

    // types.forEach(([key, type], i) => {
    //   let mapping = Object.values(mappings[i])[0].mappings[type.es_type]
    //     .properties
    //   type.mapping = mapping
    //   type.nested_fields = getNestedFields(mapping)
    // })

    // let schema = await makeSchema({ types })

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
        types.map(([type]) =>
          readFile(mappingFolder(type), {
            encodpng: 'utf8',
          }),
        ),
      )
      res.json({
        mappings: mappings.map(d => JSON.parse(d)).reduce((acc, item, i) => {
          let [[type, mapping]] = Object.entries(item)
          return {
            ...acc,
            [types[i][0]]: mapping,
          }
        }, {}),
      })
    })

    app.use('/mappingsToSchema', bodyParser.json(), async (req, res) => {
      let types = Object.entries(req.body.mappings)

      types.forEach(([key, type], i) => {
        // let mapping = Object.values(mappings[i])[0].mappings[type.es_type]
        // .properties
        type.mapping = type.properties
        type.es_type = key
        type.name = capitalize(key)
        type.index = ''
        // type.nested_fields = getNestedFields(type.mapping)
        type.nested_fields = []
      })

      let schema
      try {
        schema = await makeSchema({ types })
      } catch (e) {
        console.warn(123, e)
        return res.json({ valid: false })
      }

      let ep = `blah${+new Date()}`

      app.use(
        [`/${ep}`],
        bodyParser.json(),
        graphqlExpress({ schema, context: { es } }),
      )

      res.json({ ep, valid: true })
    })

    // app.use('/dataToAggregations', async (req, res) => {
    //   let r = await es.bulk({
    //     body: [
    //       // action description
    //       { index: { _index: 'myindex', _type: 'mytype', _id: 1 } },
    //       // the document to index
    //       { title: 'foo' },
    //       // action description
    //       { update: { _index: 'myindex', _type: 'mytype', _id: 2 } },
    //       // the document to update
    //       { doc: { title: 'foo' } },
    //       // action description
    //       { delete: { _index: 'myindex', _type: 'mytype', _id: 3 } },
    //       // no document needed for this delete
    //     ],
    //   })
    //
    //   console.log(r)
    //
    //   res.json({ success: true })
    // })

    app.use('/dataToAggregations', bodyParser.json(), async (req, res) => {
      try {
        await es.indices.delete({ index: 'demo' })
      } catch (e) {
        console.warn(e)
      }

      let types = Object.entries(req.body.data)

      let body = flattenDeep(
        types.map(([_type, docs]) =>
          docs.map((doc, i) => [
            { index: { _index: 'demo', _type, _id: _type + i } },
            JSON.stringify(doc),
          ]),
        ),
      )

      await es.bulk({ body })

      let mappings = await Promise.all(
        types.map(([type]) =>
          es.indices.getMapping({
            index: 'demo',
            type,
          }),
        ),
      )

      mappings = mappings.reduce((acc, mapping) => {
        let [[type, mappings]] = Object.entries(mapping.demo.mappings)
        return {
          ...acc,
          [type]: mappings,
        }
      }, {})

      types = Object.entries(mappings)

      types.forEach(([key, type], i) => {
        // let mapping = Object.values(mappings[i])[0].mappings[type.es_type]
        // .properties
        type.mapping = type.properties
        type.es_type = key
        type.name = capitalize(key)
        type.index = 'demo'
        type.nested_fields = getNestedFields(type.mapping)
      })

      let schema
      try {
        schema = await makeSchema({ types })
      } catch (e) {
        console.warn(123, e)
        return res.json({ valid: false })
      }

      let ep = `blah${+new Date()}`

      app.use(
        [`/${ep}/:query`],
        bodyParser.json(),
        graphqlExpress({ schema, context: { es } }),
      )

      res.json({ valid: true, mappings, ep })
    })

    // app.use(
    //   ['/graphql', '/graphql/:query'],
    //   bodyParser.json(),
    //   graphqlExpress({ schema, context: { es } }),
    // )

    app.listen(process.env.API_PORT, () =>
      rainbow(`⚡️ Listening on port ${process.env.API_PORT} ⚡️`),
    )
  } catch (e) {
    console.warn(e)
  }
}
