import mappingToAggsType from './mappingToAggsType'

export default ({ type, mapping, fields = '' }) => `
  type ${type.plural} {
    hits(
      score: String
      query: String
      offset: Int
      sort: [Sort]
      filters: JSON
      before: String
      after: String
      first: Int
      last: Int
    ): ${type.singular}Connection

    aggregations(
      filters: JSON

      # Should term aggregations be affected by queries that contain filters on their field. For example if a query is filtering primary_site by Blood should the term aggregation on primary_site return all values or just Blood. Set to False for UIs that allow users to select multiple values of an aggregation.
      aggregations_filter_themselves: Boolean
    ): [${type.plural}Aggregations]
  }

  type ${type.plural}Aggregations {
    ${mappingToAggsType(mapping)}
  }

  type ${type.singular}Connection {
    total: Int!
    edges: [${type.singular}Edge]
  }

  type ${type.singular}Edge {
    node: ${type.singular}
  }

  type ${type.singular} implements Node {
    id: ID!
    ${fields}
  }
`
