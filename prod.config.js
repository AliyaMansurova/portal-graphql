import GraphQLJSON from 'graphql-type-json'

export let JSONScalar = 'FiltersArgument'

export let SCALARS = {
  [JSONScalar]: GraphQLJSON,
}

export let ES_TYPES = {
  annotations: {
    index: process.env.ES_GDC_FROM_GRAPH_INDEX,
    es_type: process.env.ES_ANNOTATION_TYPE,
    name: 'Annotation',
  },
  projects: {
    index: process.env.ES_GDC_FROM_GRAPH_INDEX,
    es_type: process.env.ES_PROJECT_TYPE,
    name: 'Project',
    nested_fields: [
      'summary.data_categories',
      'summary.experimental_strategies',
    ],
    customFields: `
      disease_type: [String]
      primary_site: [String]
    `,
  },
  cases: {
    index: process.env.ES_GDC_FROM_GRAPH_INDEX,
    es_type: process.env.ES_CASE_TYPE,
    name: 'Case',
    customFields: `
      aliquot_ids: [String]
      available_variation_data: [String]
    `,
  },
  files: {
    index: process.env.ES_GDC_FROM_GRAPH_INDEX,
    es_type: process.env.ES_FILE_TYPE,
    name: 'File',
  },
  case_centric: {
    index: process.env.ES_CASE_CENTRIC_INDEX,
    es_type: process.env.ES_CASE_CENTRIC_TYPE,
    name: 'ECase',
  },
  gene_centric: {
    index: process.env.ES_GENE_CENTRIC_INDEX,
    es_type: process.env.ES_GENE_CENTRIC_TYPE,
    name: 'Gene',
    customFields: `
      cytoband: [String]
    `,
  },
  ssm_centric: {
    index: process.env.ES_SSM_CENTRIC_INDEX,
    es_type: process.env.ES_SSM_CENTRIC_TYPE,
    name: 'Ssm',
  },
  ssm_occurrence_centric: {
    index: process.env.ES_SSM_OCC_CENTRIC_INDEX,
    es_type: process.env.ES_SSM_OCC_CENTRIC_TYPE,
    name: 'SsmOccurrenceCentric',
  },
}

export let ROOT_TYPES = {
  repository: {
    typeDefs: `
      type Repository {
        cases: Case
        files: File
      }
    `,
    resolvers: {
      cases: () => ({}),
      files: () => ({}),
    },
    deprecationReason: 'Use top level fields for ES types',
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
      ssms: () => ({}),
    },
    deprecationReason: 'Use top level fields for ES types',
  },
  user: {
    typeDefs: `
      type User {
        username: String
      }
    `,
    resolvers: {
      username: () => 'user',
    },
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
      top_cases_count_by_genes: () => ({}),
    },
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
    // resolvers: {
    // data: async (obj, { gene_ids = [], first = 0}) => {
    //   let data = await fetch(process.env.GDCAPI + '/top_cases_counts_by_genes', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       gene_ids: gene_ids.join(),
    //       size: first,
    //       filters: json.dumps(args.get('filters', { op: 'and', content: [] })),
    //     }),
    //   }).then(r => r.json())
    //   console.log(data)
    //   return '{}'
    // },
    // }
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
  },
}
