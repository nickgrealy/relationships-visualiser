import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-yaml'
import * as React from 'react'
import styled from 'styled-components'
import Button from '../components/Button'
import { rawYamlString, parseYaml } from '../components/ComponentDataYaml'
import { Flex } from '../components/Flex'
import Overlay from '../components/Overlay'
import Stage from '../components/Stage'
import Window from '../components/Window'
import './style.css'
import 'prismjs/themes/prism-coy.css'
import { isDef } from '../common/utils'

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

const Title = styled.b`padding:15px 0px;`

/**
 * Creates the landing page.
 */
const IndexPage = () => {
  const tmp = parseYaml(rawYamlString)
  const [showPopup, setShowPopup] = React.useState(true)
  const [rawYaml, setRawYaml] = React.useState(rawYamlString)
  const [components, setComponents] = React.useState(tmp)

  const [visibleTypes, setVisibleTypes] = React.useState({})
  const [draggableTypes, setDraggableTypes] = React.useState({})

  // copy previous values
  React.useEffect(() => {
    setVisibleTypes(prev => {
      const tmp = { ...components.MAP_TYPES_TRUE }
      Object.keys(prev).forEach(k => {
        if (isDef(tmp[k])) tmp[k] = prev[k]
      })
      return tmp
    })
    setDraggableTypes(prev => {
      const tmp = { ...components.MAP_TYPES_FALSE }
      Object.keys(prev).forEach(k => {
        if (isDef(tmp[k])) tmp[k] = prev[k]
      })
      return tmp
    })
  }, [components])

  React.useEffect(() => {
    console.log(draggableTypes)
    if (draggableTypes.machine !== true) setDraggableTypes(t => ({ ...t, machine: true }))
  }, [])

  return <React.Fragment>
      {/* popup */}
      <Overlay flex="growchild" show={showPopup} setShowPopup={setShowPopup}>
        <Window flex="grow" style={{ margin: '25vh 10vw 5vw 10vw' }}>
          <Title>Edit Model</Title>
        <Flex flex="scroll-y">
          <div style={{ minHeight: '100px', width: '100%' }}>
          <Editor
            className="editor"
            value={rawYaml}
            onValueChange={code => {
              console.log('code updated...')
              setRawYaml(code)
              setComponents(parseYaml(code))
            }}
            highlight={code => highlight(code, languages.yaml)}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12
            }}
          />
          </div>

        </Flex>
        <Flex flex="center" style={{ marginTop: '15px' }}>
          <Button onClick={() => setShowPopup(false)}>Close window</Button>
        </Flex>
        </Window>
      </Overlay>

      {/* window */}
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
