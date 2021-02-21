import styled from 'styled-components'
import THEME from '../common/Theme'

/**
 * The base class for all buttons.
 * @example
 * <Button className="align-left align-right space-between colour-orange">Click me!</Button
 */
const Button = styled.button`
display:flex;
justify-content:center;
align-items:center;
padding: 4px 20px;
font-size:14px;
line-height:20px;
margin-bottom:4px;

// alignment
&.align-right {
    justify-content:flex-end;
}
&.align-left {
    justify-content:flex-start;
}
&.space-between {
    justify-content:space-between;
}

// theme: default
background: white;
border: 1px solid grey;
color: black;
&:hover {
    cursor: pointer;
    background: ghostwhite;
}

// theme: orange
&.colour-orange {
    color: white;
    background: ${THEME.awsMidOrange};
    border: 1px solid ${THEME.awsMidOrange};
    &:hover {
        background: ${THEME.awsDarkOrange};
    }
}
`

export default Button
