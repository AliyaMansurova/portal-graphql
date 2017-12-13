import GraphQLJSON from "graphql-type-json";
import getFields from "graphql-fields";
import { startCase, capitalize } from "lodash";
import { typeDefs as MutationTypeDefs } from "./Mutation";
import { typeDefs as AggregationsTypeDefs } from "./Aggregations";
import { typeDefs as SortTypeDefs } from "./Sort";
import { createConnectionResolvers, mappingToFields } from "~/utils";
import { resolveNested } from "~/utils/resolveHits";
import { addResolveFunctionsToSchema } from "graphql-tools";

let RootTypeDefs = ({ types, rootTypes }) => `
  scalar JSON

  ${Object.keys(global.config.SCALARS).map(type => `scalar ${type}`)}

  interface Node {
    id: ID!
  }

  type FileSize {
    value: Float
  }

  type QueryResults {
    total: Int
    hits: [Node]
  }

  type Root {
    node(id: ID): Node
    viewer: Root
    query(query: String, types: [String]): QueryResults
    ${rootTypes.map(([key]) => `${key}: ${startCase(key).replace(/\s/g, "")}`)}
    ${types.map(([key, type]) => `${key}: ${type.name}`)}
  }

  ${rootTypes.map(([, type]) => type.typeDefs)}

  schema {
    query: Root
    # mutation: Mutation
  }
`;

export let typeDefs = ({ types, rootTypes }) => [
  RootTypeDefs({ types, rootTypes }),
  // MutationTypeDefs,
  AggregationsTypeDefs,
  SortTypeDefs,
  ...types.map(([key, type]) => mappingToFields({ key, type }))
];

let resolveObject = () => ({});

export let resolvers = ({ types, rootTypes }) => {
  return {
    JSON: GraphQLJSON,
    Root: {
      viewer: resolveObject,
      query: async (obj, args, { es }, info) => {
        let node_types = null,
          inner_path_id_pairs = {};
        let indices = "gdc_from_graph,gene_centric,ssm_centric";
        let doc_type =
          args["types"] ||
          "project,case,file,annotation,gene_centric,ssm_centric";
        let nested_fields = Object.keys(inner_path_id_pairs) || [];

        let graphql_fields = getFields(info, nested_fields);

        let body = {
          _source: Object.keys(getFields(info).hits),
          size: args["first"] || 5,
          from: args["offset"] || 0,
          query: {
            multi_match: {
              query: args["query"],
              type: "best_fields",
              fields: [
                "project_autocomplete.lowercase^32400000000",
                "project_autocomplete.prefix^32400000",
                "project_autocomplete.analyzed^32400000",
                "gene_autocomplete.lowercase^16900000000",
                "gene_autocomplete.prefix^1690000",
                "gene_autocomplete.analyzed^1690000",
                "case_autocomplete.lowercase^6400000000",
                "case_autocomplete.prefix^64000",
                "case_autocomplete.analyzed^64000",
                "ssm_autocomplete.lowercase^2500000000",
                "ssm_autocomplete.prefix^2500",
                "ssm_autocomplete.analyzed^2500",
                "file_autocomplete.lowercase^900000000",
                "file_autocomplete.prefix^90",
                "file_autocomplete.analyzed^90",
                "annotation_autocomplete.lowercase^100000000",
                "annotation_autocomplete.prefix^1",
                "annotation_autocomplete.analyzed^1"
              ]
            }
          }
        };
        let data = await es.search({
          type: doc_type,
          body: body,
          index: indices
        });
        let hits = data.hits;
        let nodes = hits.hits.map(x => {
          let source = x._source;
          let nested_nodes = resolveNested({
            node: source,
            nested_fields
          });
          return {
            __typename: `${capitalize(x._type)}Node`,
            id: x._id,
            ...source,
            ...nested_nodes
          };
        });
        return {
          total: hits.total,
          hits: nodes
        };
      },
      ...[...types, ...rootTypes].reduce(
        (acc, [key]) => ({
          ...acc,
          [key]: resolveObject
        }),
        {}
      )
    },
    Node: {
      __resolveType(data, ctx, info) {
        return info.schema.getType(data.__typename);
      }
    },
    ...types.reduce(
      (acc, [key, type]) => ({
        ...acc,
        ...createConnectionResolvers({
          type
        })
      }),
      {}
    ),
    ...rootTypes.reduce(
      (acc, [key, type]) => ({
        ...acc,
        ...(type.resolvers
          ? { [startCase(key).replace(/\s/g, "")]: type.resolvers }
          : {})
      }),
      {}
    ),
    ...Object.entries(global.config.SCALARS).reduce(
      (acc, [scalar, resolver]) => ({
        ...acc,
        [scalar]: resolver
      }),
      {}
    )
  };
};
