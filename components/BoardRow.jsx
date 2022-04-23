import Guess from './Guess';

const BoardRow = ({ index, attempt, answer }) => {

  //If the attempt is blank create a mock attempt with all spaces
  if (attempt.length < 5){
    attempt = "     "
  }

  //Determine which letter are correct, incorrect or misplaced
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

  for (let space of uncheckedSpaces) {
    if (availableLetters.includes(attempt[space])) {
      misplacedSpaces.push(space);
    }
  }

  //Create the squares with css depending on the correctness of the letter
  const createGuessSquares = attempt.split('').map(function(letter, i) {
    return (
      <Guess
        value={letter}
        key={"guess-" + i} 
        guessClass={ letter == " " ? "guess" : correctSpaces.includes(i) ? "guess correct" : (misplacedSpaces.includes(i) ? "guess misplaced" : "guess incorrect")}
      />
    )
  });

  return(
    <div className="board-row">
      {createGuessSquares}
    </div>
)};

export default BoardRow;