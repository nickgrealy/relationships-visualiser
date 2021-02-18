import * as React from 'react'
import Draggable from 'react-draggable'
import styled from 'styled-components'
import {
  LINKS,
  MAP_BY_MEMBER_OF, ROOT_LEVEL_COMPONENTS
} from '../components/content'
import { DirectionalLine } from '../components/DirectionalLine'
import THEME from '../components/Theme'
import { Flex } from './Flex'

// user config
const isTypeDraggable = { machine: true }

// styles

const Comp = styled.div`

// N.B. inline-block must go with valign:top
display:inline-block;
vertical-align: top;

// main
border-radius: ${THEME.radius};
position:relative;
padding: 10px;
padding-top:40px;
min-width:200px;
min-height: 20px;
box-sizing: border-box;
border:1px solid grey;
box-shadow: 4px 4px 4px rgba(0,0,0,0.3);
background:white;

&.visible-false {
    padding:0px !important;
    border-width:0px; !important;
    background:transparent !important;
    box-shadow: none;
    > .title {
        display:none;
    }
}

&.react-draggable {
  cursor: pointer;
}

// title

> .title {
  background:lightgray;
  // border
  border-top:1px solid grey;
  border-left:1px solid grey;
  border-right:1px solid grey;
  // radius
  border-top-left-radius:${THEME.radius};
  border-top-right-radius:${THEME.radius};
  box-sizing: border-box;
  padding: 0px 10px;
  font-size:14px;
  line-height:${THEME.titleHeight};
  height: ${THEME.titleHeight};
  position:absolute;
  top:-1px;
  left:-1px;
  right:-1px;
}

// custom styles

&.type-vpc {
  border-color: ${THEME.awsGold};
  min-width:800px;
  > .title { 
    border-color: ${THEME.awsGold};
    background: linear-gradient(${THEME.awsGold}, ${THEME.awsDarkGold});
    color: white;
  }
}
&.type-machine {
  margin-right:100px;
  border-color: ${THEME.awsOrange};
  > .title { 
    border-color: ${THEME.awsOrange};
    background: linear-gradient(${THEME.awsOrange}, ${THEME.awsDarkOrange});
    color: white;
  }
}
&.type-service {
  display:flex;
  flex-direction:column;
}
&.type-queue {
  padding:0px;
  border-radius:0px;
  background: linear-gradient(${THEME.awsBlue}, ${THEME.awsDarkBlue});
  > .title {
    color:white;
    background:transparent;
    border-width:0px;
    position:relative !important;
  }
  &:nth-child(n+2) {
    margin-top:-1px;
  }
}
`

const DrawComp = ({ comp = null, depth = 0, toggleTypes = {}, ...draggableProps }) => {
  if (depth > 10) return null
  const isVisible = toggleTypes[comp.type]
  const component = <Comp id={comp.id} name={`${comp.name} (${comp.type})`} className={`type-${comp.type} visible-${isVisible}`}>
    <div className="title">{comp.name} ({comp.type})</div>
    {/* draw child components */}
    { MAP_BY_MEMBER_OF[comp.id] && MAP_BY_MEMBER_OF[comp.id].map(child => {
      return <DrawComp key={child.id} comp={child} depth={depth + 1} toggleTypes={toggleTypes} {...draggableProps} />
    })}
  </Comp>
  return isTypeDraggable[comp.type] === true ? (<Draggable {...draggableProps}>{component}</Draggable>) : (component)
}

/**
 *
 */
const Stage = ({ toggleTypes = {} }) => {
  const [links, setLinks] = React.useState(LINKS)
  const [rootLevelComponents] = React.useState(ROOT_LEVEL_COMPONENTS)

  const redrawLines = () => setLinks([...links])

  React.useEffect(() => {
    window.addEventListener('resize', redrawLines)
    return () => { window.removeEventListener('resize', redrawLines) }
  })

  return (
    <Flex flex="growchild grow" style={{ padding: '15px' }}>

      {/* draw boxes */}
      { rootLevelComponents.map(root => <DrawComp
        key={root.id}
        comp={root}
        onDrag={redrawLines}
        onStop={redrawLines}
        toggleTypes={toggleTypes}
      />)}

      {/* draw arrows */}
      { links.map(link => <DirectionalLine key={`${link.from}-${link.to}-${link.direction}`} {...link} />) }

    </Flex>
  )
}

export default Stage
