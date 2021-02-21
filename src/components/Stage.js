import * as React from 'react'
import Draggable from 'react-draggable'
import styled from 'styled-components'
import { DirectionalLine } from '../components/DirectionalLine'
import THEME from '../common/Theme'
import { Flex } from './Flex'
import { throttle } from 'throttle-debounce'
import { isDef } from '../common/utils'

// styles

const Comp = styled.div`

// N.B. inline-block must go with valign:top
display:inline-block;
vertical-align: top;

// main
border-radius: ${THEME.radius};
position:relative;
padding: 30px 0px 0px 0px;
margin: 10px;
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

&.draggable-true {
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

// &.type-vpc {
//   border-color: ${THEME.awsGold};
//   min-width:800px;
//   > .title { 
//     border-color: ${THEME.awsGold};
//     background: linear-gradient(${THEME.awsGold}, ${THEME.awsDarkGold});
//     color: white;
//   }
// }
// &.type-machine {
//   margin-right:100px;
//   border-color: ${THEME.awsOrange};
//   > .title { 
//     border-color: ${THEME.awsOrange};
//     background: linear-gradient(${THEME.awsOrange}, ${THEME.awsDarkOrange});
//     color: white;
//   }
// }

// store children vertically
&.vertical-children {
  display:flex;
  flex-direction:column;
  padding:40px 10px 10px 10px;
}

// stack elements vertically
&.stack-vertically {
  padding:0px !important;
  border-radius:0px !important;
  > .title {
    border-radius:0px !important;
    border-width:0px !important;
    position:initial !important;
  }
  &:nth-child(n+2) {
    margin:-1px 0 0 0;
  }
}

// custom styling
// &.type-message-broker > .title {
//   background: linear-gradient(${THEME.awsBlue}, ${THEME.awsDarkBlue});
//   color:white;
// }
`

/**
 * Draws a component, and recursively draws it's children.
 */
const DrawComp = React.memo(({ components = {}, comp = null, depth = 0, visibleTypes = {}, draggableTypes = {}, columnLayoutTypes = {}, ...draggableProps }) => {
  const { MAP_BY_MEMBER_OF = {} } = components
  if (depth > 10) return null
  const passDownProps = { components, visibleTypes, draggableTypes, columnLayoutTypes, ...draggableProps }
  const isVisible = visibleTypes[comp.type]
  const isDraggable = draggableTypes[comp.type]
  const isColumnLayout = columnLayoutTypes[comp.type]
  const children = MAP_BY_MEMBER_OF[comp.id] || []
  const doChildrenHaveChildren = children.some(child => (MAP_BY_MEMBER_OF[child.id] || []).length > 0)
  const hasParent = depth > 0
  const hasChildren = children.length > 0
  // console.debug(comp.name, isColumnLayout)
  const isVerticalLayout = isDef(isColumnLayout) ? isColumnLayout : !doChildrenHaveChildren
  const stackVertically = !hasChildren && hasParent

  const component = <Comp
    id={comp.id}
    className={`type-${comp.type} visible-${isVisible} ${stackVertically ? 'stack-vertically' : ''} ${isVerticalLayout ? 'vertical-children' : ''} `}
  >
    <div className="title">{comp.name}{comp.type ? ` (${comp.type})` : ''}</div>
    {/* draw child components */}
    { children.map(child => {
      return <DrawComp key={child.id} comp={child} depth={depth + 1} {...passDownProps} />
    })}
  </Comp>
  console.debug('draggableTypes #3', draggableTypes)
  return <Draggable
      disabled={!isDraggable}
      defaultClassName={`draggable-${isDraggable}`}
      {...draggableProps}
    >
      {component}
    </Draggable>
})

/**
 * The stage area; for presenting components.
 */
const Stage = ({ components = {}, visibleTypes = {}, draggableTypes = {} }) => {
  const { LINKS = [], ROOT_LEVEL_COMPONENTS = [] } = components
  const [rootLevelComponents, setRootLevelComponents] = React.useState(ROOT_LEVEL_COMPONENTS)
  const [links, setLinks] = React.useState(LINKS)

  // a function to facilitate redrawing lines (e.g. when boxes are moved)
  const redrawLines = React.useCallback(throttle(20, false, () => {
    setLinks(x => ([...x]))
  }), [])

  // update state on changes...
  React.useEffect(() => setLinks(LINKS), [LINKS])
  React.useEffect(() => setRootLevelComponents(ROOT_LEVEL_COMPONENTS), [ROOT_LEVEL_COMPONENTS])

  // redraw the lines, if the window is resizes (e.g. if boxes are moved)
  // todo: redraw lines on scroll?
  React.useEffect(() => {
    window.addEventListener('resize', redrawLines)
    return () => { window.removeEventListener('resize', redrawLines) }
  })

  return (
    <Flex flex="growchild grow" style={{ padding: '15px', background: THEME.awsGreyBackground }}>

      {/* recursively draw components */}
      { rootLevelComponents.map(root => <DrawComp
        key={root.id}
        components={components}
        comp={root}
        onDrag={redrawLines}
        onStop={redrawLines}
        visibleTypes={visibleTypes}
        draggableTypes={draggableTypes}
      />)}

      {/* draw directional links between components */}
      { links.map(link => <DirectionalLine key={`${link.from}-${link.to}-${link.direction}`} {...link} />) }

    </Flex>
  )
}

export default Stage
