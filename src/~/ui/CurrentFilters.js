// @flow
import React from 'react'
import { take, xor, omit } from 'lodash'
import { Route } from 'react-router-dom'
import { parse } from 'query-string'
// import UndoIcon from 'react-icons/lib/md/undo';
// import LeftArrow from 'react-icons/lib/fa/long-arrow-left';
// import Cogs from 'react-icons/lib/fa/cogs';
// import Color from 'color';
// import {
//   compose,
//   withState,
//   pure,
//   withHandlers,
//   withPropsOnChange,
//   withProps,
// } from 'recompose';

// import { humanify } from '@ncigdc/utils/string';
// import withRouter from '@ncigdc/utils/withRouter';

// import Button, { buttonBaseStyles } from '@ncigdc/uikit/Button';
// import { Row } from '@ncigdc/uikit/Flex';
// import Info from '@ncigdc/uikit/Info';

// import { buttonLike } from '@ncigdc/theme/mixins';
// import UnstyledButton from '@ncigdc/uikit/UnstyledButton';
import Link from './Link'

// import { facetFieldDisplayMapper } from '@ncigdc/components/Aggregations';
import { parseJSONParam } from './uri'

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

let Aux = p => p.children

const CurrentFilters = (
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
        <span key={`${filter.content.field}.${filter.op}.${value.join()}`}>
          <Link
            className="test-field-name"
            merge="toggle"
            query={{
              offset: 0,
              filters: {
                op: 'and',
                content: [filter],
              },
            }}
          >
            <span>{filter.content.field}</span>
          </Link>
          <span>{getDisplayOp(filter.op, value)}</span>
          {value.length > 1 && <span style={styles.leftParen}>(</span>}
          {value.map(value => (
            <Link
              className="test-field-value"
              key={value}
              merge="toggle"
              query={{
                offset: 0,
                filters: {
                  op: 'and',
                  content: [
                    {
                      op: filter.op,
                      content: {
                        field: filter.content.field,
                        value: [value],
                      },
                    },
                  ],
                },
              }}
            >
              <span>{value}</span>
            </Link>
          ))}
          {value.length > 1 && <span style={styles.rightParen}>)</span>}
          {i < currentFilters.length - 1 && <div>AND</div>}
        </span>
      )
    })}
  </Aux>
)
/*----------------------------------------------------------------------------*/

// export default enhance(CurrentFilters);

export default () => (
  <div className="current-filters">
    <div className="section-title">FILTERS:</div>
    {/* <input /> */}
    <Route>
      {p => {
        let s = parse(p.location.search).filters
        console.log(s)
        return !s ? null : (
          <CurrentFilters currentFilters={JSON.parse(s).content} />
        )
      }}
    </Route>
  </div>
)
