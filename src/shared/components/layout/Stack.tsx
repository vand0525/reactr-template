import { createElement } from 'react'
import type { StackProps } from './types'
import { resolveSpaceToken } from '../../utils'

function resolveAlignment(alignment?: StackProps['alignment']) {
  switch (alignment) {
    case 'start':
      return 'flex-start'
    case 'center':
      return 'center'
    case 'end':
      return 'flex-end'
    case 'stretch':
      return 'stretch'
    case 'baseline':
      return 'baseline'
    default:
      return undefined
  }
}

function resolveJustify(justify?: StackProps['justify']) {
  switch (justify) {
    case 'start':
      return 'flex-start'
    case 'center':
      return 'center'
    case 'end':
      return 'flex-end'
    case 'between':
      return 'space-between'
    case 'around':
      return 'space-around'
    case 'evenly':
      return 'space-evenly'
    default:
      return undefined
  }
}

export function Stack({
  tag = 'div',
  direction = 'column',
  spacing,
  alignment,
  justify,
  wrap,
  children,
  className,
  style,
  ...rest
}: StackProps) {
  return createElement(
    tag,
    {
      ...rest,
      className,
      style: {
        display: 'flex',
        flexDirection: direction,
        gap: resolveSpaceToken(spacing),
        alignItems: resolveAlignment(alignment),
        justifyContent: resolveJustify(justify),
        flexWrap: wrap ? 'wrap' : undefined,
        ...style,
      },
    },
    children,
  )
}