import React from 'react'
import styled from 'styled-components'
import { Flex } from './Flex'

export const BaseOverlay = styled(Flex)`
position:absolute;
top:0;
left:0;
right:0;
bottom:0;
width:100%;
height:100%;
z-index: 2147483647;
`

const Backdrop = styled(BaseOverlay)`
background: rgba(0,0,0,0.3);
opacity: 1;
transition: opacity 0.2s;
z-index: 2147483646 !important;
backdrop-filter: blur(1px);
&.hide {
    opacity: 0;
    pointer-events: none;
    // display:none; // -> doesn't facilitate animations
}
`

const Overlay = ({ show = false, setShowPopup = undefined, children = [], ...props }) => {
  const backdropRef = React.useRef(null)

  const hideOnBackdropClick = React.useCallback(e => {
    const isBackdropClick = e.target === backdropRef.current
    console.debug('isBackdropClick=' + isBackdropClick, { target: e.target, backdropRef: backdropRef.current })
    if (isBackdropClick) setShowPopup(false)
  }, [backdropRef])

  return <Backdrop
    innerRef={backdropRef}
    className={show ? '' : 'hide'}
    onClick={hideOnBackdropClick}
    {...props}
    >
      {children}
    </Backdrop>
}

export default Overlay
