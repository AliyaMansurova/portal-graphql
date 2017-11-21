import React from 'react'
import _ from 'lodash'
import { Route } from 'react-router-dom'
import Link from './Link'
import { parse } from 'query-string'
import { inCurrentFilters } from './filters'

export default props => {
  const dotField = props.field.replace(/__/g, '.')
  const filteredBuckets = props.buckets

  return (
    <div style={props.style} className="test-term-aggregation">
      {dotField}
      <div>
        {_.orderBy(filteredBuckets, 'doc_count', 'desc')
          // .slice(0, props.showingMore ? Infinity : 5)
          .map(b => ({ ...b, name: b.key_as_string || b.key }))
          .map(bucket => (
            <div key={bucket.name}>
              <Route>
                {p => (
                  <Link
                    className="bucket-link"
                    merge="toggle"
                    query={{
                      ...parse(p.location.search),
                      offset: 0,
                      filters: {
                        op: 'and',
                        content: [
                          {
                            op: 'in',
                            content: {
                              field: dotField,
                              value: [bucket.name],
                            },
                          },
                        ],
                      },
                    }}
                  >
                    <input
                      readOnly
                      type="checkbox"
                      style={{
                        pointerEvents: 'none',
                        marginRight: '5px',
                        flexShrink: 0,
                        verticalAlign: 'middle',
                      }}
                      checked={inCurrentFilters({
                        key: bucket.name,
                        dotField,
                        currentFilters: JSON.parse(
                          parse(p.location.search).filters,
                        ).content,
                      })}
                      id={`input-${props.title}-${bucket.name.replace(
                        /\s/g,
                        '-',
                      )}`}
                      name={`input-${props.title}-${bucket.name.replace(
                        /\s/g,
                        '-',
                      )}`}
                    />
                    {bucket.name}
                    {/* <OverflowTooltippedLabel
                    htmlFor={`input-${props.title}-${bucket.name.replace(
                      /\s/g,
                      '-',
                    )}`}
                    style={{
                      marginLeft: '0.3rem',
                      verticalAlign: 'middle',
                    }}
                  >
                    {bucket.name}
                  </OverflowTooltippedLabel> */}
                  </Link>
                )}
              </Route>
              <span className="bucket-count">
                {bucket.doc_count.toLocaleString()}
              </span>
            </div>
          ))}
      </div>
    </div>
  )
}
