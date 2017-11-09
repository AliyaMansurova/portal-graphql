import elasticsearch from 'elasticsearch'
import ping from './ping'
import spinupServer from './server'

if (process.env.WITH_ES) {
  let esconfig = {
    host: process.env.ES_HOST,
  }

  if (process.env.ES_TRACE) esconfig.log = process.env.ES_TRACE

  let es = new elasticsearch.Client(esconfig)

  ping(es)
    .then(() => spinupServer(es))
    .catch(err => {
      spinupServer()
    })
} else {
  spinupServer()
}
