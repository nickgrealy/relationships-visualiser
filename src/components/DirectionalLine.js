import * as React from 'react'
import Xarrow from 'react-xarrows'
import THEME from './Theme'

const LINE_WIDTH = 1

/**
 * Draws a directional line.
 *
 * @param {*} from - the element's id
 * @param {*} to - the element's id
 * @param {*} direction - in / out / both
 */
export const DirectionalLine = ({ from, to, direction }) => {
  const offset = {
    startAnchor: { position: 'auto', offset: { bottomness: 4 } },
    endAnchor: { position: 'auto', offset: { bottomness: 4 } }
  }
  if (direction === 'both') {
    return <React.Fragment>
        <Xarrow
            start={from}
            end={to}
            strokeWidth={LINE_WIDTH}
            headSize={0}
            path='straight'
            dashness={{ strokeLen: 10, nonStrokeLen: 3, animation: 1 }}
            color={THEME.awsDarkTeal}
            />
        <Xarrow
            start={to}
            end={from}
            strokeWidth={LINE_WIDTH}
            headSize={0}
            path='straight'
            dashness={{ strokeLen: 10, nonStrokeLen: 3, animation: 1 }}
            color={THEME.awsDarkTeal}
            {...offset}
            />
        </React.Fragment>
  } else if (direction === 'in') {
    return <Xarrow
        start={to}
        end={from}
        strokeWidth={LINE_WIDTH}
        headSize={0}
        path='straight'
        dashness={{ strokeLen: 10, nonStrokeLen: 3, animation: 1 }}
        color={THEME.awsDarkBlue}
        />
  } else if (direction === 'out') {
    return <Xarrow
        start={from}
        end={to}
        strokeWidth={LINE_WIDTH}
        headSize={0}
        path='straight'
        dashness={{ strokeLen: 10, nonStrokeLen: 3, animation: 1 }}
        color={THEME.awsDarkBlue}
        />
  }
}
