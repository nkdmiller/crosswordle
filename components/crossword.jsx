import React from 'react';
import { useState, useEffect } from 'react';
import crossword from '../data/puzzle';
import {useRouter} from "next/router";
import Modal from "./Modal";
import Link from "next/link";
import { createContext } from 'react';

export const CrosswordContext = createContext();

const Crossword = () => {
  let router = useRouter();
  const [words, setWords] = useState([]);
  const [wordMap, setWordMap] = useState([]);
  const [rows, setRows] = useState([]);
  const [crosswordBoard, setCrosswordBoard] = useState([]);
  const [solved, setSolved] = useState(false);
  const [reset, setReset] = useState(false);

  const [highlightedHorizontalWord, setHighlightedHorizontalWord] = useState(-1);
  const [highlightedVerticalWord, setHighlightedVerticalWord] = useState(-1);

  useEffect(() => {

    let wordState;
    let boardState;
    const stateStr = localStorage.getItem('words');
    const existingWords = stateStr ? JSON.parse(stateStr) : undefined;
    if (existingWords) {
      wordState = existingWords;
    } else {
      const initial = crossword.words.map(function(word) {
        let newWord = word;
        newWord.attempts = ["","","","","","",];
        newWord.numberOfAttempts = 0;
        newWord.solved = false;
        return newWord;
      })
      wordState = initial;
    }
    const boardStr = localStorage.getItem('crosswordBoard');
    const existingBoard = stateStr ? JSON.parse(boardStr) : undefined;
    if (existingBoard) {
      boardState = existingBoard;
    } else {
      let initial = [];
      for(var i=0; i< crossword.wordMap.length; i++) {
        initial[i] = new Array(crossword.wordMap[0].length);
      }
      boardState = initial;
    }

    const isSolved = localStorage.getItem('solved') ? true : false;

    setWords(wordState);
    setWordMap(crossword.wordMap);
    setRows(crossword.rows);
    setCrosswordBoard(boardState);
    setSolved(isSolved);
    setReset(false);
  }, [reset])

  useEffect(() => {
    window.localStorage.setItem('words', JSON.stringify(words));
    window.localStorage.setItem('crosswordBoard', JSON.stringify(crosswordBoard));
    setSolved(checkForSolution());
  }, [words])

  const handleAttempt = (wordNumber, attempt) => {
    let solved = false;
    attempt = attempt.toUpperCase();
    setWords(prevState => {
      let wordsToUpdate = Object.assign([], prevState);
      let wordIndex = wordsToUpdate.findIndex(w => wordNumber == w.number);
      let newWordObj = wordsToUpdate[wordIndex];
      newWordObj.attempts[newWordObj.numberOfAttempts] = attempt;
      newWordObj.numberOfAttempts = newWordObj.numberOfAttempts + 1;
      wordsToUpdate[wordIndex] = newWordObj;
      if (attempt == newWordObj.word.toUpperCase()){
        newWordObj.solved = true;
        solved = true;
      }
      return wordsToUpdate;
    });

    setCrosswordBoard(prevState => {
      let newBoard = Object.assign([], prevState);
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
  };

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
        if (word.direction == "vertical"){
          vertical = element;
        }
        if (word.direction == "horizontal"){
          horizontal = element;
        }
      }
    }
    setHighlightedHorizontalWord(horizontal);
    setHighlightedVerticalWord(vertical);
  }

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

  const resetBoard = () => {
    localStorage.removeItem('words');
    localStorage.removeItem('crosswordBoard');
    localStorage.removeItem('solved');
    setReset(true);
  }

  const createSquares = rows.map(function(row_arr, r) {
    const verticalWords = {}
    const horizontalWords = {}
    return row_arr.map(function(item, c) {
      if (item == " ") {
        verticalWords[c] += item;
        horizontalWords[r] += item;
        return <div className="blank-square" row={r} column={c} key={r + ":" + c} ></div>;
      }
      let isHighlightVertical = false;
      let isHighlightHorizontal = false;
      let value = wordMap[r][c];
      const matches = words.map(w => {
        if (value.includes(w.number)){
          return w.number;
        }
      })
      if (matches.includes(highlightedHorizontalWord)){
        isHighlightHorizontal = true;
      }
      if (matches.includes(highlightedVerticalWord)) {
        isHighlightVertical = true;
      }

      return (
        <Link href={"/?row=" + r + "&column=" + c + "&number=" + value[0]} key={"square-" + r + ":" + c} >
          <div key={"square-" + r + ":" + c} className={"crossword-square " + (isHighlightVertical ? 'vertical-highlight ' : ' ') + (isHighlightHorizontal ? 'horizontal-highlight' : '')} row={r} column={c} word-value={value} onClick={highlightWord} onMouseEnter={highlightWord}>{crosswordBoard[r][c]}</div>
        </Link>
      )  
    })
  });
  return(
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
      {solved && (
        <div class="solved-message">You solved it! </div>
      )}
      <div className="container">
        {createSquares}
      </div>
      <button type="button" onClick={resetBoard}>Reset</button>
  </div>
)};

export default Crossword;