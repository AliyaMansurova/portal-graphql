import React from 'react'
import { Route, Link } from 'react-router-dom'
import { parse } from 'query-string'
import Location from './Location'
import Aux from './Aux'

export const getDisplayOp = (op: string, value: Array<string>) => {
  if (op.toLowerCase() === 'in') {
    if (value.length === 1) {
      if (typeof value[0] === 'string' && value[0].includes('set_id')) {
        return 'IN'
      }
      return 'IS'
    }
    return 'IN'
  }
  return op
}

// const enhance = compose(
//   withRouter,
//   withPropsOnChange(['query'], ({ query: { filters } }) => ({
//     filters: parseJSONParam(filters),
//   })),
//   withPropsOnChange(['filters'], ({ filters }) => ({
//     currentFilters: (filters && filters.content) || [],
//   })),
//   withState('expandedFilters', 'setExpandedFilters', []),
//   withProps(({ expandedFilters }) => ({
//     isFilterExpanded: filter => expandedFilters.includes(filter),
//   })),
//   withProps(() => ({
//     getDisplayValue: (field, value) => {
//       switch (typeof value) {
//         case 'string':
//           if (value.includes('set_id:')) {
//             return <SetId set={value} />;
//           }
//           if (field === 'genes.gene_id') {
//             return <GeneSymbol geneId={value} />;
//           }
//           return value;
//         case 'boolean':
//           return value ? 'true' : 'false';
//         case 'number':
//           return value;
//         default:
//           return value;
//       }
//     },
//   })),
//   withHandlers({
//     onLessClicked: ({ expandedFilters, setExpandedFilters }) => filter => {
//       setExpandedFilters(xor(expandedFilters, [filter]));
//     },
//   }),
//   pure,
// );

const styles = {
  leftParen: {
    fontSize: '2rem',
    marginRight: '0.3rem',
    display: 'flex',
    alignItems: 'center',
  },
  rightParen: {
    fontSize: '2rem',
    marginRight: '0.3rem',
    display: 'flex',
    alignItems: 'center',
  },
  groupPadding: {
    padding: '0.5rem 0',
  },
}

let CurrentFilters = (
  {
    query,
    currentFilters,
    onLessClicked,
    isFilterExpanded = () => {},
    style,
    linkPathname,
    linkText,
    linkFieldMap = f => f,
    hideLinkOnEmpty = true,
    getDisplayValue = () => {},
  } = {},
) => (
  <Aux>
    {currentFilters.map((filter, i) => {
      const value = [].concat(filter.content.value || [])

      return (
        <span
          className="current-filter-content"
          key={`${filter.content.field}.${filter.op}.${value.join()}`}
        >
          {/* <Link
            className="test-field-name"
            merge="toggle"
            query={{
              offset: 0,
              filters: {
                op: 'and',
                content: [filter],
              },
            }}
          > */}
          <span>{filter.content.field}</span>
          {/* </Link> */}
          <span>{getDisplayOp(filter.op, value)}</span>
          {value.length > 1 && <span style={styles.leftParen}>(</span>}
          {value.map(value => (
            // <Link
            //   className="test-field-value"
            //   key={value}
            //   merge="toggle"
            //   query={{
            //     offset: 0,
            //     filters: {
            //       op: 'and',
            //       content: [
            //         {
            //           op: filter.op,
            //           content: {
            //             field: filter.content.field,
            //             value: [value],
            //           },
            //         },
            //       ],
            //     },
            //   }}
            // >
            <span key={value}>{value}</span>
            // </Link>
          ))}
          {value.length > 1 && <span style={styles.rightParen}>)</span>}
          {i < currentFilters.length - 1 && <div>AND</div>}
        </span>
      )
    })}
  </Aux>
)

export default ({ history }) => (
  <span className="current-filters">
    <Location>
      {p => {
        let s = p.filters
        console.log(s)
        return !s ? null : (
          <Aux>
            <CurrentFilters currentFilters={s.content} />{' '}
            <span
              className="clear-filters"
              onClick={() => history.push({ search: null })}
            >
              clear
            </span>
          </Aux>
        )
      }}
    </Location>
  </span>
)
