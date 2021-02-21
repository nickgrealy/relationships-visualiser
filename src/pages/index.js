
import * as React from 'react'
import styled from 'styled-components'
import { copyValuesIfExists } from '../common/utils'
import Button from '../components/Button'
import rawYamlString from '../common/SampleYamlString'
import { parseYaml } from '../common/YamlPostProcessor'
import { Flex } from '../components/Flex'
import Overlay from '../components/Overlay'
import Stage from '../components/Stage'
import THEME from '../common/Theme'
import Window from '../components/Window'
import YamlEditor from '../components/YamlEditor'
import { list, save } from '../common/Storage'
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
 * Shows a text editor for modifying the model in Yaml.
 *
 * @param {*} param0
 */
const EditorPopupWindow = ({ showEditorPopup, setShowEditorPopup, rawYaml, setRawYaml, setComponents, errorMessage, setErrorMessage }) => {
  return <Overlay flex="growchild" show={showEditorPopup} setShowPopup={setShowEditorPopup}>
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
              const newComponents = parseYaml(code)
              console.log(newComponents.root)
              setComponents(newComponents)
              setErrorMessage(false)
              save(newComponents.root.name, code)
            } catch (err) {
              setErrorMessage(err.message)
            }
          }}
        />
      </div>
    </Flex>
    { errorMessage && <Title style={{ color: THEME.awsRed }}>Error: {errorMessage}</Title>}
    <Flex flex="center" style={{ marginTop: '15px' }}>
      <Button onClick={() => setShowEditorPopup(false)}>Close window</Button>
    </Flex>
    </Window>
  </Overlay>
}

/**
 * Shows a list of saved - allows loading from the list..
 *
 * @param {*} param0
 */
const LoadPopupWindow = ({ showLoadPopup, setShowLoadPopup, setComponents, errorMessage, setErrorMessage }) => {
  return <Overlay flex="growchild" show={showLoadPopup} setShowPopup={setShowLoadPopup}>
    <Window flex="grow" style={{ margin: '45px 50vw 45px 45px' }}>
    <Title>Load Model</Title>
    <Flex flex="scroll-y">
      <div style={{ minHeight: '100px', width: '100%' }}>
        { list().map(key => <div key={key}>{key}</div>)}
      </div>
    </Flex>
    <Flex flex="center" style={{ marginTop: '15px' }}>
      <Button onClick={() => setShowLoadPopup(false)}>Load selected model</Button>
    </Flex>
    </Window>
  </Overlay>
}

/**
 * Creates the landing page.
 */
const IndexPage = () => {
  const tmp = parseYaml(rawYamlString)
  const [showEditorPopup, setShowEditorPopup] = React.useState(false)
  const [showLoadPopup, setShowLoadPopup] = React.useState(false)
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
      {/* editor popup window */}
      <EditorPopupWindow {...{ showEditorPopup, setShowEditorPopup, rawYaml, setRawYaml, setComponents, errorMessage, setErrorMessage }} />

      {/* load popup window */}
      <LoadPopupWindow {...{ showLoadPopup, setShowLoadPopup, rawYaml, setRawYaml, setComponents, errorMessage, setErrorMessage }} />

      {/* left sidebar */}
      <Flex flex="grow">
        <Sidebar>
          <Button onClick={() => setShowEditorPopup(true)}>Edit Model</Button>
          <Button onClick={() => setShowLoadPopup(true)}>Load Model</Button>
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
