import elasticsearch from 'elasticsearch'
import ping from './ping'
import spinupExpress from './spinupExpress'

if (process.env.WITH_ES) {
  let es = new elasticsearch.Client({
    host: process.env.ES_HOST,
    log: 'trace',
  })

  ping(es).then(() => spinupExpress(es))
} else {
  spinupExpress()
}
