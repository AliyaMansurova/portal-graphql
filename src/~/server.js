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
import uuid from 'uuid/v4'
import bb from 'bodybuilder'

export default async es => {
  let rootTypes = Object.entries(global.config.ROOT_TYPES)
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

    types.forEach(([key, type], i) => {
      let mapping = Object.values(mappings[i])[0].mappings[type.es_type]
        .properties
      type.mapping = mapping
      type.nested_fields = getNestedFields(mapping)
    })

    let schema = await makeSchema({ types, rootTypes })

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

    // app.get('/:index/:type', async (req, res) => {
    //   let { index, type } = req.params
    //   index = index.toLowerCase()
    //   type = type.toLowerCase()
    //   let r
    //   try {
    //     r = await es.search({
    //       index,
    //       type,
    //     })
    //   } catch (e) {
    //     console.warn('no index found')
    //     res.json({ error: 'no such index' })
    //     return
    //   }
    //
    //   res.json({ hits: r.hits.hits })
    // })
    //
    // app.post('/:index/type', bodyParser.json(), async (req, res) => {
    //   let r
    //   let { type } = req.body
    //   let index = req.params.index.toLowerCase()
    //
    //   if (!type) {
    //     res.json({ error: 'Must provide a name!' })
    //     return
    //   }
    //
    //   type = type.toLowerCase()
    //
    //   try {
    //     r = await es.search({
    //       index,
    //       type: 'type',
    //       body: bb()
    //         .query('term', 'name', type)
    //         .build(),
    //     })
    //     if (r.hits.total) {
    //       res.json({ error: 'This type already exists.' })
    //       return
    //     }
    //   } catch (e) {
    //     console.warn(
    //       'no index found, probably creating index for the first time',
    //     )
    //   }
    //
    //   r = await es.create({
    //     index,
    //     type: 'type',
    //     id: uuid(),
    //     body: {
    //       name: type,
    //     },
    //   })
    //
    //   res.json({ success: true })
    // })
    //
    // app.get('/mappings', async (req, res) => {
    //   let mappings = await Promise.all(
    //     types.map(([type]) =>
    //       readFile(mappingFolder(type), {
    //         encodpng: 'utf8',
    //       }),
    //     ),
    //   )
    //   res.json({
    //     mappings: mappings.map(d => JSON.parse(d)).reduce((acc, item, i) => {
    //       let [[type, mapping]] = Object.entries(item)
    //       return {
    //         ...acc,
    //         [types[i][0]]: mapping,
    //       }
    //     }, {}),
    //   })
    // })
    //
    // app.use('/mappingsToSchema', bodyParser.json(), async (req, res) => {
    //   let types = Object.entries(req.body.mappings)
    //
    //   types.forEach(([key, type], i) => {
    //     // let mapping = Object.values(mappings[i])[0].mappings[type.es_type]
    //     // .properties
    //     type.mapping = type.properties
    //     type.es_type = key
    //     type.name = capitalize(key)
    //     type.index = ''
    //     // type.nested_fields = getNestedFields(type.mapping)
    //     type.nested_fields = []
    //   })
    //
    //   let schema
    //   try {
    //     schema = await makeSchema({ types })
    //   } catch (e) {
    //     return res.json({ valid: false })
    //   }
    //
    //   let ep = `blah${+new Date()}`
    //
    //   app.use(
    //     [`/${ep}`],
    //     bodyParser.json(),
    //     graphqlExpress({ schema, context: { es } }),
    //   )
    //
    //   res.json({ ep, valid: true })
    // })
    //
    // app.use('/dataToAggregations', bodyParser.json(), async (req, res) => {
    //   let { project, type, docs } = req.body
    //
    //   project = project.toLowerCase()
    //   type = type.toLowerCase()
    //
    //   let index = `${project}_${type}`
    //
    //   try {
    //     await es.indices.delete({ index })
    //     console.log(`${index} index wiped`)
    //   } catch (e) {
    //     console.warn('index not created yet')
    //   }
    //
    //   if (docs.length) {
    //     if (docs.some(doc => !Object.keys(doc).length)) {
    //       res.json({ error: 'objects must have keys' })
    //       return
    //     }
    //     try {
    //       let body = flattenDeep(
    //         docs.map(doc => [
    //           { index: { _index: index, _type: type, _id: uuid() } },
    //           JSON.stringify(doc),
    //         ]),
    //       )
    //
    //       console.warn(`bulk insert: ${docs}`)
    //       await es.bulk({ body })
    //     } catch (e) {
    //       res.json({ error: 'malformed documents' })
    //       return
    //     }
    //   }
    //
    //   let r
    //
    //   try {
    //     r = await es.search({
    //       index: project,
    //       type: 'type',
    //     })
    //   } catch (e) {
    //     console.warn('no index found')
    //   }
    //
    //   let types = r.hits.hits.map(x => x._source.name)
    //
    //   let mappings = (await Promise.all(
    //     types.map(type =>
    //       es.indices
    //         .getMapping({
    //           index,
    //           type,
    //         })
    //         .catch(() => null),
    //     ),
    //   )).filter(Boolean)
    //
    //   if (!mappings.length) {
    //     res.json({ error: 'no mappings' })
    //     return
    //   }
    //
    //   mappings = mappings.reduce((acc, mapping) => {
    //     let [index] = Object.values(mapping)
    //     let [[type, mappings]] = Object.entries(index.mappings)
    //     return {
    //       ...acc,
    //       [type]: mappings,
    //     }
    //   }, {})
    //
    //   types = Object.entries(mappings)
    //
    //   types.forEach(([key, type], i) => {
    //     type.mapping = type.properties
    //     type.es_type = key
    //     type.name = capitalize(key)
    //     type.index = index
    //     type.nested_fields = getNestedFields(type.mapping)
    //   })
    //
    //   let schema
    //   try {
    //     schema = await makeSchema({ types })
    //   } catch (e) {
    //     return res.json({ valid: false })
    //   }
    //
    //   let ep = `blah${+new Date()}`
    //
    //   app.use(
    //     [`/${ep}/:query`],
    //     bodyParser.json(),
    //     graphqlExpress({ schema, context: { es } }),
    //   )
    //
    //   res.json({ valid: true, mappings, ep })
    // })

    app.use(
      ['/graphql', '/graphql/:query'],
      bodyParser.json(),
      graphqlExpress({ schema, context: { es } }),
    )

    app.listen(process.env.API_PORT, () =>
      rainbow(`⚡️ Listening on port ${process.env.API_PORT} ⚡️`),
    )
  } catch (e) {
    console.warn(e)
  }
}
