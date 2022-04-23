import { React, useState, useEffect } from 'react';
import crossword from '../data/puzzle';
import {useRouter} from "next/router";
import Modal from "./modal";
import Link from "next/link";

const Crossword = () => {
  let router = useRouter();
  const [words, setWords] = useState([]);
  const [wordMap, setWordMap] = useState([]);
  const [rows, setRows] = useState([]);
  const [crosswordBoard, setCrosswordBoard] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(false);
  const [reset, setReset] = useState(false);

  const [highlightedHorizontalWord, setHighlightedHorizontalWord] = useState(-1);
  const [highlightedVerticalWord, setHighlightedVerticalWord] = useState(-1);

  useEffect(() => {
    //Initial states
    let wordState;
    let boardState;
    //Attempt to grab wordState from local storage
    const stateStr = localStorage.getItem('words');
    const existingWords = stateStr ? JSON.parse(stateStr) : undefined;
    if (existingWords) {
      wordState = existingWords;
    } else {
      //Set initial if not in storage
      const initial = crossword.words.map(function(word) {
        let newWord = word;
        newWord.attempts = ["","","","","","",];
        newWord.numberOfAttempts = 0;
        newWord.solved = false;
        return newWord;
      })
      wordState = initial;
    }
    //Attempt to grab boardState from local storage
    const boardStr = localStorage.getItem('crosswordBoard');
    const existingBoard = stateStr ? JSON.parse(boardStr) : undefined;
    if (existingBoard) {
      boardState = existingBoard;
    } else {
      //Set initial if not in storage
      let initial = [];
      for(var i=0; i< crossword.wordMap.length; i++) {
        initial[i] = new Array(crossword.wordMap[0].length);
      }
      boardState = initial;
    }
    //Attempt to grab solved from local storage; false otherwise
    const isSolved = localStorage.getItem('solved') ? true : false;

    //Attempt to grab attempts from local storage; 0 otherwise
    const attemptsStr = localStorage.getItem('attempts');
    const attemptsState = attemptsStr ? parseInt(JSON.parse(attemptsStr)) : 0;

    setWords(wordState);
    setWordMap(crossword.wordMap);
    setRows(crossword.rows);
    setCrosswordBoard(boardState);
    setAttempts(attemptsState);
    setSolved(isSolved);
    setReset(false);
  }, [reset])

  useEffect(() => {
    //Store words, attempts and board state whenever the words are updated (e.g an attempt is made)
    window.localStorage.setItem('words', JSON.stringify(words));
    window.localStorage.setItem('attempts', JSON.stringify(attempts));
    window.localStorage.setItem('crosswordBoard', JSON.stringify(crosswordBoard));
    setSolved(checkForSolution());
  }, [words])

  const handleAttempt = (wordNumber, attempt) => {
    let solved = false;
    attempt = attempt.toUpperCase();
    //Add the attempt to the last position in the word's attempt array
    setWords(prevState => {
      let wordsToUpdate = Object.assign([], prevState);
      let wordIndex = wordsToUpdate.findIndex(w => wordNumber == w.number);
      let newWordObj = wordsToUpdate[wordIndex];
      newWordObj.attempts[newWordObj.numberOfAttempts] = attempt;
      newWordObj.numberOfAttempts = newWordObj.numberOfAttempts + 1;
      wordsToUpdate[wordIndex] = newWordObj;
      //If the attempt is equal to the word then mark it as solved
      if (attempt == newWordObj.word.toUpperCase()){
        newWordObj.solved = true;
        solved = true;
      }
      return wordsToUpdate;
    });

    setCrosswordBoard(prevState => {
      let newBoard = Object.assign([], prevState);
      //If the word was solved then add it to the crossword board
      if (solved){
        for(var r=0; r< wordMap.length; r++) {
          for(var c=0; c< wordMap.length; c++) {
            if (wordMap[r][c].includes(wordNumber)){
              newBoard[r][c] = rows[r][c];
            }
          }
        }
      }
      return newBoard;
    })

    //Whether or not the word was solved increment the number of attempts
    setAttempts(attempts + 1);
  };

  //Highlight the row or column of the square that was just hovered over by the user
  const highlightWord = (e) => {
    let horizontal = -1;
    let vertical = -1;
    let value = e.target.attributes.getNamedItem("word-value").value.split(",");
    for (let index = 0; index < value.length; index++) {
      const element = parseInt(value[index]);
      const word = crossword.words.find(w => {
        return element == w.number;
      })
      if (word){
        if (word.direction == "horizontal"){
          horizontal = element;
        }
        if (word.direction == "vertical"){
          vertical = element;
        }
      }
    }

    setHighlightedHorizontalWord(horizontal);
    setHighlightedVerticalWord(vertical);
  }

  //Iterate through each word and set solved in local storage
  const checkForSolution = () => {
    let isSolved = words.length > 0 ? true : false;
    words.forEach((word) => {
      if (word.solved == false) {
        isSolved = false;
      }
    });
    if (isSolved == true){
      window.localStorage.setItem('solved', "YES");
    }
    return isSolved;
  }

  //Clear local storage and then force a reset to initial values
  const resetBoard = () => {
    localStorage.removeItem('words');
    localStorage.removeItem('crosswordBoard');
    localStorage.removeItem('solved');
    localStorage.removeItem('attempts');
    setReset(true);
  }

  //Iterate through the row
  const createSquares = rows.map(function(row_arr, r) {
    //Iterate through the column
    return row_arr.map(function(item, c) {
      //If the letter of this row and column is blank then return a "blank-square"
      if (item == " ") {
        return <div className="blank-square" row={r} column={c} key={r + ":" + c} ></div>;
      }

      let isHighlightVertical = false;
      let isHighlightHorizontal = false;
      //Get the one or more words (id'd by number) that the square corresponds.
      let value = wordMap[r][c];
      const matches = words.map(w => {
        if (value.includes(w.number)){
          return w.number;
        }
      })
      //If one of the matched words has been marked for highlight set the appropriate flag which will determine CSS background-color
      if (matches.includes(highlightedHorizontalWord)){
        isHighlightHorizontal = true;
      }
      if (matches.includes(highlightedVerticalWord)) {
        isHighlightVertical = true;
  
      }

      //Return an active square with the aboce calculated CSS class
      return (
        <Link href={"/?row=" + r + "&column=" + c } key={"square-" + r + ":" + c} >
          <div key={"square-" + r + ":" + c} className={"crossword-square " + (isHighlightVertical ? 'vertical-highlight ' : ' ') + (isHighlightHorizontal ? 'horizontal-highlight' : '')} row={r} column={c} word-value={value} onMouseEnter={highlightWord}>{crosswordBoard[r][c]}</div>
        </Link>
      )  
    })
  });
  return(
    <div className="crossword-board">
      <div>
        {router.query.row && (
          <Modal
            onClose={() => {
              router.push("/");
            }}
            handleAttempt={handleAttempt}
            words={words}
            wordMap={wordMap}
            rows={rows}
          >
            <div className="box">
            </div>
          </Modal>
        )}
        {!solved && (
          <div className="attempt-number">{"Number of Attempts: " + attempts}</div>
        )}
        {solved && (
          <div className="solved-message">{"You solved it in " + attempts + " moves!"} </div>
        )}
        <div className="container">
          {createSquares}
        </div>
      </div>
      <div>
        <button type="button" onClick={resetBoard} className="reset-button">Reset</button>
      </div>
    </div>
)};

export default Crossword;