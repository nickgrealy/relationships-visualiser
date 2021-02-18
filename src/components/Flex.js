import * as React from 'react'
import styled from 'styled-components'

// styles

export const Flex = styled(({ className = '', flex = '', ...props }) => <div className={`${flex} ${className}`} {...props} />)`
  display: flex;
  &.growchild > * {
    flex: 1 1 auto;
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
