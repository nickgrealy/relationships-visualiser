import * as React from 'react'
import { Flex } from '../components/Flex'
import Stage from '../components/Stage'
import { MAP_TYPE_TO_COUNT } from '../components/content'
import styled from 'styled-components'
import './style.css'

const Sidebar = styled(Flex)`
width: 200px;
border-right: 1px solid grey;
background: ghostwhite;
padding:15px;
flex-direction:column;
box-shadow: 5px 5px 5px rgba(0,0,0,0.1);
`

/**
 *
 */
const IndexPage = () => {
  const [toggleTypes, setToggleTypes] = React.useState(Object.fromEntries(Object.keys(MAP_TYPE_TO_COUNT).map(k => [k, true])))

  return <Flex className="grow">
    <Sidebar>
      <p>
        <b>Toggle Show Types</b>
      </p>
      { Object.entries(toggleTypes).map(([k, v]) => {
        return <button
        key={k}
        onClick={() => setToggleTypes({ ...toggleTypes, [k]: !v })}>
          {`${k} (${MAP_TYPE_TO_COUNT[k]}) - ${v ? 'visible' : 'hidden'}`}
        </button>
      })}
    </Sidebar>
    <Stage {...{ toggleTypes }} />
  </Flex>
}

export default IndexPage
