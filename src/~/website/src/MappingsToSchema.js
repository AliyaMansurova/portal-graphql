import React, { Component } from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import MonacoEditor from 'react-monaco-editor'
import { debounce } from 'lodash'
import GraphiQL from 'graphiql'
import 'graphiql/graphiql.css'
import './App.css'

let API = 'http://localhost:5050'

let graphQLFetcher = ep => graphQLParams => {
  console.log(3333, API + `/${ep}`)
  return fetch(API + `/${ep}`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graphQLParams),
  }).then(response => response.json())
}

let gene_centric = {
  gene_centric: {
    _all: {
      enabled: false,
    },
    _source: {
      excludes: ['case.*'],
    },
    properties: {
      biotype: {
        type: 'keyword',
      },
      canonical_transcript_id: {
        type: 'keyword',
        copy_to: ['gene_autocomplete'],
      },
      canonical_transcript_length: {
        type: 'long',
      },
      canonical_transcript_length_cds: {
        type: 'long',
      },
      canonical_transcript_length_genomic: {
        type: 'long',
      },
      cytoband: {
        type: 'keyword',
        copy_to: ['gene_autocomplete'],
      },
      description: {
        type: 'text',
      },
      external_db_ids: {
        properties: {
          entrez_gene: {
            type: 'keyword',
            copy_to: ['gene_autocomplete'],
          },
          hgnc: {
            type: 'keyword',
            copy_to: ['gene_autocomplete'],
          },
          omim_gene: {
            type: 'keyword',
            copy_to: ['gene_autocomplete'],
          },
          uniprotkb_swissprot: {
            type: 'keyword',
            copy_to: ['gene_autocomplete'],
          },
        },
      },
      gene_autocomplete: {
        type: 'keyword',
        fields: {
          analyzed: {
            type: 'text',
            analyzer: 'autocomplete_analyzed',
            search_analyzer: 'lowercase_keyword',
          },
          lowercase: {
            type: 'text',
            analyzer: 'lowercase_keyword',
          },
          prefix: {
            type: 'text',
            analyzer: 'autocomplete_prefix',
            search_analyzer: 'lowercase_keyword',
          },
        },
      },
      gene_chromosome: {
        type: 'keyword',
      },
      gene_end: {
        type: 'long',
      },
      gene_id: {
        type: 'keyword',
        copy_to: ['gene_autocomplete'],
      },
      gene_start: {
        type: 'long',
      },
      gene_strand: {
        type: 'long',
      },
      is_cancer_gene_census: {
        type: 'boolean',
      },
      name: {
        type: 'keyword',
        copy_to: ['gene_autocomplete'],
      },
      symbol: {
        type: 'keyword',
        copy_to: ['gene_autocomplete'],
      },
      synonyms: {
        type: 'keyword',
        copy_to: ['gene_autocomplete'],
      },
      transcripts: {
        type: 'nested',
        properties: {
          biotype: {
            type: 'keyword',
          },
          cdna_coding_end: {
            type: 'long',
          },
          cdna_coding_start: {
            type: 'long',
          },
          coding_region_end: {
            type: 'long',
          },
          coding_region_start: {
            type: 'long',
          },
          domains: {
            type: 'nested',
            properties: {
              description: {
                type: 'keyword',
              },
              end: {
                type: 'long',
              },
              gff_source: {
                type: 'keyword',
              },
              hit_name: {
                type: 'keyword',
              },
              interpro_id: {
                type: 'keyword',
              },
              start: {
                type: 'long',
              },
            },
          },
          end: {
            type: 'long',
          },
          end_exon: {
            type: 'long',
          },
          exons: {
            type: 'nested',
            properties: {
              cdna_coding_end: {
                type: 'long',
              },
              cdna_coding_start: {
                type: 'long',
              },
              cdna_end: {
                type: 'long',
              },
              cdna_start: {
                type: 'long',
              },
              end: {
                type: 'long',
              },
              end_phase: {
                type: 'long',
              },
              genomic_coding_end: {
                type: 'long',
              },
              genomic_coding_start: {
                type: 'long',
              },
              start: {
                type: 'long',
              },
              start_phase: {
                type: 'long',
              },
            },
          },
          is_canonical: {
            type: 'boolean',
          },
          length: {
            type: 'long',
          },
          length_amino_acid: {
            type: 'long',
          },
          length_cds: {
            type: 'long',
          },
          name: {
            type: 'keyword',
          },
          number_of_exons: {
            type: 'long',
          },
          seq_exon_end: {
            type: 'long',
          },
          seq_exon_start: {
            type: 'long',
          },
          start: {
            type: 'long',
          },
          start_exon: {
            type: 'long',
          },
          transcript_id: {
            type: 'keyword',
            copy_to: ['gene_autocomplete'],
          },
          translation_id: {
            type: 'keyword',
            copy_to: ['gene_autocomplete'],
          },
        },
      },
    },
  },
}

let case_c = {
  case: {
    properties: {
      case_id: {
        type: 'keyword',
      },
      test: {
        type: 'float',
      },
    },
  },
}

class App extends Component {
  state = {
    code: 'test',
    valid: false,
    loading: true,
    mappings: JSON.stringify(gene_centric, null, 2),
  }
  componentDidMount() {
    this.dmap = debounce(this.map2S, 300)
    this.onChange(this.state.mappings)
  }
  onChange = (newValue, e) => {
    let mappings
    let valid
    try {
      mappings = JSON.parse(newValue)
      valid = true
    } catch (e) {
      valid = false
    }
    if (valid) {
      this.setState({ loading: true })
      this.dmap(mappings)
    } else {
      this.setState({ valid: false })
    }
    this.setState({ mappings: newValue })
  }
  map2S = mappings => {
    console.log(1111, mappings)
    fetch(API + '/mappingsToSchema', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mappings,
      }),
    })
      .then(r => r.json())
      .then(d => {
        this.setState({ ep: d.ep, valid: d.valid, loading: false })
      })
  }
  render() {
    const options = {
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: false,
      cursorStyle: 'line',
      automaticLayout: false,
      minimap: {
        enabled: false,
      },
    }

    return (
      <div
        style={{
          display: 'flex',
          height: 'calc(100vh - 100px)',
          overflow: 'hidden',
        }}
      >
        <MonacoEditor
          language="json"
          value={this.state.mappings}
          options={options}
          onChange={this.onChange}
          editorDidMount={this.editorDidMount}
        />
        {!this.state.valid &&
          !this.state.loading && (
            <div style={{ width: '350px', padding: 20 }}>Invalid mapping.</div>
          )}
        {this.state.loading && (
          <div style={{ width: '350px', padding: 20 }}>Loading.</div>
        )}
        {this.state.valid &&
          !this.state.loading && (
            <GraphiQL fetcher={graphQLFetcher(this.state.ep)} />
          )}
      </div>
    )
  }
}

export default App
