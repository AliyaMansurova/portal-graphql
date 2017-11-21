import React from 'react'
import { NavLink as Link, Route } from 'react-router-dom'
import _ from 'lodash'
import { mergeQuery as mq } from './filters'
//
import { stringify, parse } from 'query-string'
import { stringifyJSONParam } from './uri'
// import removeEmptyKeys from '@ncigdc/utils/removeEmptyKeys'

const reactRouterLinkProps = [
  'to',
  'replace',
  'activeClassName',
  'activeStyle',
  'exact',
  'strict',
  'isActive',
]

const InternalLink = ({ pathname, query, deepLink, ...rest }) => {
  const q0 = query || {}
  const f0 = q0.filters ? stringifyJSONParam(q0.filters) : null

  const q1 = {
    ...q0,
    filters: f0,
  }

  // const q = removeEmptyKeys(q1)

  const validLinkProps = _.pick(rest, reactRouterLinkProps)

  const search = stringify(q1)

  return (
    <Link
      to={{
        pathname,
        search,
      }}
      {...rest}
    />
  )
}

const InternalLinkWithContext = ({
  pathname,
  query,
  merge,
  mergeQuery,
  whitelist,
  ...rest
}: TLinkProps) => (
  <Route>
    {p => {
      let ctx = { query: parse(p.location.search) }
      const pn = pathname || p.location.pathname

      const mergedQuery =
        merge && mergeQuery
          ? mergeQuery(query, ctx.query, merge, whitelist)
          : query

      const hasFilterChanged = true
      // const hasFilterChanged = _.some([
      //   // Note: empty {} passed in b/c
      //   // mergeQuery(ctx.query).filters is a JSON string
      //   // mergeQuery({}, ctx.query).filters is an object
      //   _.isEqual(
      //     _.get(mergedQuery, 'filters'),
      //     _.get(mergeQuery({}, ctx.query), 'filters'),
      //   ),
      //   _.every(
      //     [_.get(ctx.query, 'filters'), _.get(mergedQuery, 'filters')],
      //     _.isNil,
      //   ),
      // ])

      const queryWithOffsetsReset = hasFilterChanged
        ? mergedQuery
        : _.mapValues(
            mergedQuery,
            (value, paramName) => (paramName.endsWith('offset') ? 0 : value),
          )

      return (
        <InternalLink pathname={pn} query={queryWithOffsetsReset} {...rest} />
      )
    }}
  </Route>
)

export default InternalLinkWithContext
