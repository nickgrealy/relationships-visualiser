
import * as React from 'react'
import styled from 'styled-components'
import { copyValuesIfExists, isDef } from '../common/utils'
import Button from '../components/Button'
import { parseYaml, rawYamlString } from '../components/ComponentDataYaml'
import { Flex } from '../components/Flex'
import Overlay from '../components/Overlay'
import Stage from '../components/Stage'
import THEME from '../components/Theme'
import Window from '../components/Window'
import YamlEditor from '../components/YamlEditor'
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
        className={`ellipsis ${v ? 'colour-orange' : ''} space-between`}
        onClick={() => setObject({ ...object, [k]: !v })}>
          {k} {v ? <Tick /> : <Notick />}
      </Button>
  })
}

const Title = styled.b`padding:15px 0px;`

/**
 * Creates the landing page.
 */
const IndexPage = () => {
  const tmp = parseYaml(rawYamlString)
  const [showPopup, setShowPopup] = React.useState(false)
  const [rawYaml, setRawYaml] = React.useState(rawYamlString)
  const [components, setComponents] = React.useState(tmp)
  const [errorMessage, setErrorMessage] = React.useState(false)

  const [visibleTypes, setVisibleTypes] = React.useState({})
  const [draggableTypes, setDraggableTypes] = React.useState({})

  // if components change, copy previous visible/draggable options...
  React.useEffect(() => {
    setVisibleTypes(prev => copyValuesIfExists(prev, { ...components.MAP_TYPES_TRUE }))
    setDraggableTypes(prev => copyValuesIfExists(prev, { ...components.MAP_TYPES_FALSE }))
  }, [components])

  // if machine exists, make it draggable by default...
  React.useEffect(() => {
    if (draggableTypes.machine !== true) setDraggableTypes(t => ({ ...t, machine: true }))
  }, [])

  return <React.Fragment>
      {/* popup window */}
      <Overlay flex="growchild" show={showPopup} setShowPopup={setShowPopup}>
        <Window flex="grow" style={{ margin: '45px 50vw 45px 45px' }}>
        <Title>Edit Model</Title>
        <Flex flex="scroll-y">
          <div style={{ minHeight: '100px', width: '100%' }}>
            <YamlEditor
              value={rawYaml}
              onChange={code => {
                // set raw yaml must be first, never block the text from updating@
                setRawYaml(code)
                try {
                  setComponents(parseYaml(code))
                  setErrorMessage(false)
                } catch (err) {
                  setErrorMessage(err.message)
                }
              }}
            />
          </div>
        </Flex>
        { errorMessage && <Title style={{ color: THEME.awsRed }}>Error: {errorMessage}</Title>}
        <Flex flex="center" style={{ marginTop: '15px' }}>
          <Button onClick={() => setShowPopup(false)}>Close window</Button>
        </Flex>
        </Window>
      </Overlay>

      {/* left sidebar */}
      <Flex flex="grow">
        <Sidebar>
          <Button onClick={() => setShowPopup(true)}>Edit Model</Button>
          <Title>Toggle Visibility</Title>
          <ToggleButtons object={visibleTypes} setObject={setVisibleTypes} />
          <Title>Toggle Draggable</Title>
          <ToggleButtons object={draggableTypes} setObject={setDraggableTypes} />
        </Sidebar>
        <Stage {...{ components, visibleTypes, draggableTypes }} />
      </Flex>
    </React.Fragment>
}

export default IndexPage
