import elasticsearch from 'elasticsearch'
import ping from './ping'
import spinupServer from './server'

if (process.env.WITH_ES) {
  let es = new elasticsearch.Client({
    host: process.env.ES_HOST,
    // log: process.env.ES_TRACE,
  })

  ping(es)
    .then(() => spinupServer(es))
    .catch(err => {
      spinupServer()
    })
} else {
  spinupServer()
}
