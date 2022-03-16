import React from 'react'

const click = () => {
  console.log("hello")
}
const Crossword = ({}) => {
  return(
  <svg width="400" height="400">
    <rect onClick={click} width="50" height="50" />
  </svg>
)};

export default Crossword;