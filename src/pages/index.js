import * as React from 'react'
import { Flex } from '../components/Flex'
import Stage from '../components/Stage'
import { MAP_TYPES_TRUE, MAP_TYPES_FALSE } from '../components/ComponentDataYaml'
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
  return Object.keys(object).sort().map(k => {
    const v = object[k]
    return <Button
        key={k}
        className={`${v ? 'colour-orange' : ''} space-between`}
        onClick={() => setObject({ ...object, [k]: !v })}>
          {k} {v ? <Tick /> : <Notick />}
      </Button>
  })
}

/**
 * Creates the landing page.
 */
const IndexPage = () => {
  const [togglableTypes, setTogglableTypes] = React.useState({ ...MAP_TYPES_TRUE })
  const [draggableTypes, setDraggableTypes] = React.useState({ ...MAP_TYPES_FALSE })

  React.useEffect(() => {
    console.log(draggableTypes)
    if (draggableTypes.machine !== true) setDraggableTypes(t => ({ ...t, machine: true }))
  }, [])

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
