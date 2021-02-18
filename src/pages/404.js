import * as React from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby'

const Main = styled.main`
font-family:arial;
padding: 15px;
`

// markup
const NotFoundPage = () => {
  return (
    <Main>
      <title>Not found</title>
      <h1>Page not found</h1>
      <p>
        Nothing to see here. <Link to="/">Go home?</Link>
      </p>
    </Main>
  )
}

export default NotFoundPage
