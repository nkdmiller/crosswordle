import { useState } from 'react'
import BoardRow from './BoardRow';

const Board = ({ word, handleAttempt }) => {
  const [guess, setGuess] = useState("");

  //Update the guess state as long as the input is a letter or backspace
  const handleChange = (e) => {
    let newGuess = guess;
    let val = e.target.value.toUpperCase();
    if (/^[A-Z]*$/g.test(val)){
      newGuess = val;
    }
    setGuess(newGuess);
  }
  
  //Execute attempt callback and clear out guess state
  const handleSubmit = (e) => {
    handleAttempt(word.number, guess);
    setGuess("");
    e.preventDefault();
  }

  return(
    <div className="board">
      {word.solved && (
        <div className="solved-message">Solved</div>
      )}
      <BoardRow attempt={word.attempts[0]} answer={word.word} />
      <BoardRow attempt={word.attempts[1]} answer={word.word} />
      <BoardRow attempt={word.attempts[2]} answer={word.word} />
      <BoardRow attempt={word.attempts[3]} answer={word.word} />
      <BoardRow attempt={word.attempts[4]} answer={word.word} />
      <BoardRow attempt={word.attempts[5]} answer={word.word} />
      {!word.solved && (
        <form onSubmit={handleSubmit}>
          <div className="form-div">
            <input type="text" value={guess} onChange={handleChange} className="board-input" maxLength="5" disabled={word.solved}/>
          </div>
          <div className="form-div">
            <input type="submit" value="Submit" className="submit-button" disabled={guess.length == 5 ? false : true}/>
          </div>
        </form>
      )}

    </div>
)};

export default Board;