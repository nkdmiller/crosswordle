import { useState, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import Link from "next/link";
import BoardRow from './BoardRow';

const Board = ({ word, handleAttempt }) => {
  const [guess, setGuess] = useState("");

  const handleChange = (e) => {
    setGuess(e.target.value);
  }
  
  const handleSubmit = (e) => {
    handleAttempt(word.number, guess);
    setGuess("");
    e.preventDefault();
  }

  return(
    <div className="board">
      {word.solved && (
        <span>Solved</span>
      )}
      <BoardRow index={0} attempt={word.attempts[0]} answer={word.word} />
      <BoardRow index={1} attempt={word.attempts[1]} answer={word.word} />
      <BoardRow index={2} attempt={word.attempts[2]} answer={word.word} />
      <BoardRow index={3} attempt={word.attempts[3]} answer={word.word} />
      <BoardRow index={4} attempt={word.attempts[4]} answer={word.word} />
      <BoardRow index={5} attempt={word.attempts[5]} answer={word.word} />
      {!word.solved && (
        <form onSubmit={handleSubmit}>
          <input type="text" value={guess} onChange={handleChange} className="boardInput" maxLength="5" disabled={word.solved}/>
          <input type="submit" value="Submit" disabled={guess.length == 5 ? false : true}/>
        </form>
      )}

    </div>
)};

export default Board;