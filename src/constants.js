export let ES_TYPES = {
  annotation: {
    index: process.env.ES_GDC_FROM_GRAPH_INDEX,
    type: process.env.ES_ANNOTATION_TYPE,
  },
  project: {
    index: process.env.ES_GDC_FROM_GRAPH_INDEX,
    type: process.env.ES_PROJECT_TYPE,
  },
  case: {
    index: process.env.ES_GDC_FROM_GRAPH_INDEX,
    type: process.env.ES_CASE_TYPE,
  },
  file: {
    index: process.env.ES_GDC_FROM_GRAPH_INDEX,
    type: process.env.ES_FILE_TYPE,
  },
  case_centric: {
    index: process.env.ES_CASE_CENTRIC_INDEX,
    type: process.env.ES_CASE_CENTRIC_TYPE,
  },
  gene_centric: {
    index: process.env.ES_GENE_CENTRIC_INDEX,
    type: process.env.ES_GENE_CENTRIC_TYPE,
  },
  ssm_centric: {
    index: process.env.ES_SSM_CENTRIC_INDEX,
    type: process.env.ES_SSM_CENTRIC_TYPE,
  },
  ssm_occurrence_centric: {
    index: process.env.ES_SSM_OCC_CENTRIC_INDEX,
    type: process.env.ES_SSM_OCC_CENTRIC_TYPE,
  },
}
