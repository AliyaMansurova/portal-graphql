import elasticsearch from 'elasticsearch'
import ping from './ping'

let host = '142.1.177.42:9200'

let client = new elasticsearch.Client({
  host,
  log: 'trace',
})

ping(client)
