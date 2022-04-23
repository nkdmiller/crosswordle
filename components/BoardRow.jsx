import { useState, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import Link from "next/link";
import Guess from './guess';

const BoardRow = ({ index, attempt, answer }) => {

  if (attempt.length < 5){
    attempt = "     "
  }
  let availableLetters = [];
  let correctSpaces = [];
  let misplacedSpaces = [];
  let uncheckedSpaces = [];

  for (let i = 0; i < 5; i++) {
    if (attempt[i] == answer[i]) {
      correctSpaces.push(i);
    } else {
      uncheckedSpaces.push(i);
      availableLetters.push(answer[i]);
    }
  }

  console.log("correct " + correctSpaces)
  console.log("unchecked " + uncheckedSpaces)
  console.log("available " + availableLetters)
  for (let space of uncheckedSpaces) {
    if (availableLetters.includes(attempt[space])) {
      misplacedSpaces.push(space);
    }
  }
  console.log(misplacedSpaces)

  const createGuessSquares = attempt.split('').map(function(letter, i) {
    return (
      <Guess 
        value={letter} 
        guessClass={ correctSpaces.includes(i) ? "guess correct" : (misplacedSpaces.includes(i) ? "guess misplaced" : "guess incorrect")}
      />
    )
  });

  return(
    <div className="board-row">
      {createGuessSquares}
    </div>
)};

export default BoardRow;