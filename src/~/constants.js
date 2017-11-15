export let ES_TYPES = {
  annotations: {
    index: process.env.ES_GDC_FROM_GRAPH_INDEX,
    es_type: process.env.ES_ANNOTATION_TYPE,
    singular: 'Annotation',
    plural: 'Annotations',
  },
  projects: {
    index: process.env.ES_GDC_FROM_GRAPH_INDEX,
    es_type: process.env.ES_PROJECT_TYPE,
    singular: 'Project',
    plural: 'Projects',
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
    singular: 'Case',
    plural: 'Cases',
    customFields: `
      aliquot_ids: [String]
      available_variation_data: [String]
    `,
  },
  files: {
    index: process.env.ES_GDC_FROM_GRAPH_INDEX,
    es_type: process.env.ES_FILE_TYPE,
    singular: 'File',
    plural: 'Files',
  },
  case_centric: {
    index: process.env.ES_CASE_CENTRIC_INDEX,
    es_type: process.env.ES_CASE_CENTRIC_TYPE,
    singular: 'ECase',
    plural: 'ECases',
  },
  gene_centric: {
    index: process.env.ES_GENE_CENTRIC_INDEX,
    es_type: process.env.ES_GENE_CENTRIC_TYPE,
    singular: 'Gene',
    plural: 'Genes',
    customFields: `
      cytoband: [String]
    `,
  },
  ssm_centric: {
    index: process.env.ES_SSM_CENTRIC_INDEX,
    es_type: process.env.ES_SSM_CENTRIC_TYPE,
    singular: 'Ssm',
    plural: 'Ssms',
  },
  ssm_occurrence_centric: {
    index: process.env.ES_SSM_OCC_CENTRIC_INDEX,
    es_type: process.env.ES_SSM_OCC_CENTRIC_TYPE,
    singular: 'SsmOccurrenceCentric',
    plural: 'SsmOccurrencesCentric',
  },
}

export let GET_MAPPING = type => `src/~/mappings/${type}.mapping.json`
