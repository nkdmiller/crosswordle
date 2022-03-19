import React from 'react';
import crossword from '../data/puzzle';

const click = () => {
  console.log(crossword.rows)
}
const Crossword = ({}) => {
  const createSquares = crossword.rows.map(function(r, i) {
    if (r == " ")
      return <div className="blank-square" id={"item-" +i} onClick={click}></div>;
    else {
      return <div className="crossword-square" onClick={click}></div>;      
    }
  })
  return(
  <div className="container">
    {createSquares}
  </div>
)};

export default Crossword;