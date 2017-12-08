import JSONType from "./JSONTypeTemp";
import fetch from "node-fetch";
import elasticsearch from "elasticsearch";

let api = `${process.env.GDCAPI}/graphql`;

// let esconfig = {
//   host: process.env.ES_HOST
// };
// if (process.env.ES_TRACE) esconfig.log = process.env.ES_TRACE;
// let es = new elasticsearch.Client(esconfig);
let es = new elasticsearch.Client({
  host: "142.1.177.42:9200"
});

export let JSONScalar = "FiltersArgument";

export let SCALARS = {
  [JSONScalar]: JSONType(JSONScalar)
};

export let ES_TYPES = {
  annotations: {
    index: process.env.ES_GDC_FROM_GRAPH_INDEX,
    es_type: process.env.ES_ANNOTATION_TYPE,
    name: "Annotation"
  },
  projects: {
    index: process.env.ES_GDC_FROM_GRAPH_INDEX,
    es_type: process.env.ES_PROJECT_TYPE,
    name: "Project",
    nested_fields: [
      "summary.data_categories",
      "summary.experimental_strategies"
    ],
    customFields: `
      disease_type: [String]
      primary_site: [String]
      summary: ProjectSummaryNotNested
    `,
  },
  cases: {
    index: process.env.ES_GDC_FROM_GRAPH_INDEX,
    es_type: process.env.ES_CASE_TYPE,
    name: "Case",
    customFields: `
      aliquot_ids: [String]
      analyte_ids: [String]
      slide_ids: [String]
      portion_ids: [String]
      sample_ids: [String]
      submitter_aliquot_ids: [String]
      submitter_analyte_ids: [String]
      submitter_sample_ids: [String]
      submitter_slide_ids: [String]
      submitter_portion_ids: [String]
      available_variation_data: [String]
      id: ID!
    `
  },
  files: {
    index: process.env.ES_GDC_FROM_GRAPH_INDEX,
    es_type: process.env.ES_FILE_TYPE,
    name: "File"
  },
  case_centric: {
    index: process.env.ES_CASE_CENTRIC_INDEX,
    es_type: process.env.ES_CASE_CENTRIC_TYPE,
    name: "ECase"
  },
  gene_centric: {
    index: process.env.ES_GENE_CENTRIC_INDEX,
    es_type: process.env.ES_GENE_CENTRIC_TYPE,
    name: "Gene",
    customFields: `
      cytoband: [String]
    `
  },
  ssm_centric: {
    index: process.env.ES_SSM_CENTRIC_INDEX,
    es_type: process.env.ES_SSM_CENTRIC_TYPE,
    name: "Ssm"
  },
  ssm_occurrence_centric: {
    index: process.env.ES_SSM_OCC_CENTRIC_INDEX,
    es_type: process.env.ES_SSM_OCC_CENTRIC_TYPE,
    name: "SsmOccurrenceCentric"
  }
};

export let ROOT_TYPES = {
  projectSummaryNotNested: {
    typeDefs: `
      type ProjectSummaryNotNestedDataCategories {
        case_count: Int
        data_category: String
      }
      type ProjectSummaryNotNested {
        file_size: Float
        file_count: Int
        case_count: Int
        data_categories: [ProjectSummaryNotNestedDataCategories]
      }
    `,
    resolvers: () => ({}),
  },
  repository: {
    typeDefs: `
      type Repository {
        cases: Case
        files: File
      }
    `,
    resolvers: {
      cases: () => ({}),
      files: () => ({})
    },
    deprecationReason: "Use top level fields for ES types"
  },
  explore: {
    typeDefs: `
      type Explore {
        cases: ECase
        genes: Gene
        ssms: Ssm
      }
    `,
    resolvers: {
      cases: () => ({}),
      genes: () => ({}),
      ssms: () => ({})
    },
    deprecationReason: "Use top level fields for ES types"
  },
  user: {
    typeDefs: `
      type User {
        username: String
      }
    `,
    resolvers: {
      username: () => "user"
    }
  },
  analysis: {
    typeDefs: `
      type Analysis {
        protein_mutations: ProteinMutations
        top_cases_count_by_genes: TopCasesCountByGenes
        pvalue(data: [[Int]]!): Float
      }
    `,
    resolvers: {
      protein_mutations: () => ({}),
      top_cases_count_by_genes: () => ({})
    }
  },
  top_cases_count_by_genes: {
    typeDefs: `
      type TopCasesCountByGenes {
        data(
          first: Int
          gene_ids: [String]
          filters: ${JSONScalar}
        ): ${JSONScalar}
      }
    `,
    resolvers: {
      data: async (obj, { gene_ids = [], first = 0, filters }) => {
        let data = await fetch(
          process.env.GDCAPI + '/analysis/top_cases_counts_by_genes',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              gene_ids: gene_ids.join(),
              size: first,
              filters: JSON.stringify(filters),
            }),
          },
        ).then(r => r.json())
        return JSON.stringify(data)
      },
    },
  },
  protein_mutations: {
    typeDefs: `
      type ProteinMutations {
        data(
          first: Int
          offset: Int
          fields: [String]!
          score: String
          filters: ${JSONScalar}
        ): ${JSONScalar}
      }
    `,
    resolvers: {
      data: async (obj, args, context, info) => {
        const content = [
          {
            op: "NOT",
            content: {
              field: "consequence.transcript.aa_start",
              value: "MISSING"
            }
          }
        ];

        let filters = args.filters || {};
        if (filters.op && filters.content) content.push(filters);
        filters = { op: "and", content: content };

        let response = await fetch(
          "http://localhost:5000/graphql/build_filters",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...args,
              doc_type: process.env.ES_SSM_CENTRIC_TYPE,
              filters: filters,
              nested_fields: [
                "occurrence",
                "occurrence.case.exposures",
                "occurrence.case.diagnoses",
                "occurrence.case.diagnoses.treatments",
                "occurrence.case.observation",
                "occurrence.case.family_histories",
                "occurrence.case.summary.data_categories",
                "occurrence.case.summary.experimental_strategies",
                "consequence"
              ]
            })
          }
        );
        filters = await response.json();
        const body = {
          _source: args.fields,
          track_scores: !!args.score,
          size: args.first || 10,
          from: 0,
          query: filters.query
        };

        let data = await es.search({
          index: process.env.ES_SSM_CENTRIC_INDEX,
          type: process.env.ES_SSM_CENTRIC_TYPE,
          body: body
        });

        console.log(JSON.stringify(body));
        return data.hits;
      }
    }
  },
  cart_summary: {
    typeDefs: `
      type CartSummaryCasesCount {
        doc_count: Int
      }
      type CartSummaryBucket {
        cases: CartSummaryCasesCount
        doc_count: Int
        case_count: Int
        file_size: Float
        key: String
      }
      type SummaryAggregations {
        buckets: [CartSummaryBucket]
      }
      type CartSummaryAggs {
        access: SummaryAggregations
        data_format: SummaryAggregations
        data_type: SummaryAggregations
        experimental_strategy: SummaryAggregations
        project__primary_site: SummaryAggregations
        project__project_id: SummaryAggregations
        fs: FileSize
      }
      type CartSummary {
        aggregations(filters: ${JSONScalar}): CartSummaryAggs
      }
    `,
    resolvers: {
      aggregations: async (obj, args, context, info) => {
        let response = await fetch("http://localhost:5000/ui/search/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(args)
        });

        let data = await response.json(),
          keys = Object.keys(data),
          formattedData = {};

        keys.forEach((x, i) => {
          let key = x.replace(".", "__");
          formattedData[key] = data[keys[i]];
        });
        return formattedData;
      }
    }
  }
};

`{
  access: {
    buckets: () => [
      {
        doc_count: 11
      }
    ]
  }
};`;
