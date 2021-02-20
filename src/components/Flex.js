import * as React from 'react'
import styled from 'styled-components'

// styles

/**
 * A convenience element for creating flex boxes.
 * @example
 * <Flex className="growchild row col grow border" >...</Flex>
 */
export const Flex = styled(({ className = '', innerRef = undefined, flex = '', ...props }) => {
  // console.debug('Flex', { flex, className, ...props })
  return <div className={`${flex} ${className}`} ref={innerRef} {...props} />
})`
  display: flex;
  &.growchild > * {
    flex: 1 1 auto;
  }
  &.scroll-y {
    overflow-y: auto;
  }
  &.center {
    align-items: center;
    justify-content: center;
  }
  &.row {
    flex-direction: row;
  }
  &.col {
    flex-direction: column;
  }
  &.grow {
    flex: 1 1 auto;
  }
  &.border {
    border: 1px solid magenta;
  }
  `
