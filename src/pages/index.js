import * as React from 'react'
import { Flex } from '../components/Flex'
import Stage from '../components/Stage'
import { MAP_TYPE_TO_COUNT } from '../components/content'
import Button from '../components/Button'
import styled from 'styled-components'
import './style.css'

const Sidebar = styled(Flex)`
width: 200px;
border-right: 1px solid lightgray;
background: white;
padding:15px;
flex-direction:column;
box-shadow: 5px 5px 5px rgba(0,0,0,0.1);
`

const Tick = styled(props => <span {...props}>&#9745;</span>)`font-size:20px;margin-left:20px;`
const Notick = styled(props => <span {...props}>&#9744;</span>)`font-size:20px;margin-left:20px;`

const ToggleButtons = ({ object, setObject }) => {
  return Object.entries(object).map(([k, v]) => {
    return <Button
        key={k}
        className={`${v ? 'orange' : ''} align-right`}
        onClick={() => setObject({ ...object, [k]: !v })}>
          {k} {v ? <Tick /> : <Notick />}
      </Button>
  })
}

/**
 *
 */
const IndexPage = () => {
  const [togglableTypes, setTogglableTypes] = React.useState(Object.fromEntries(Object.keys(MAP_TYPE_TO_COUNT).map(k => [k, true])))
  const [draggableTypes, setDraggableTypes] = React.useState(Object.fromEntries(Object.keys(MAP_TYPE_TO_COUNT).map(k => [k, false])))

  return <Flex className="grow">
    <Sidebar>
      <p><b>Toggle Visibility</b></p>
      <ToggleButtons object={togglableTypes} setObject={setTogglableTypes} />
      <p><b>Toggle Draggable</b></p>
      <ToggleButtons object={draggableTypes} setObject={setDraggableTypes} />
    </Sidebar>
    <Stage {...{ togglableTypes, draggableTypes }} />
  </Flex>
}

export default IndexPage
