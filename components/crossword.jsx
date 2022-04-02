import React from 'react';
import { useState, useEffect } from 'react';
import crossword from '../data/puzzle';
import {useRouter} from "next/router";
import Modal from "./modal";
import Link from "next/link"; 

const Crossword = () => {
  let router = useRouter();
  const [horizontalMap, setHorizontalMap] = useState([]);
  const [verticalMap, setVerticalMap] = useState([]);

  const [highlightedHorizontalWord, setHighlightedHorizontalWord] = useState([]);
  const [highlightedVerticalWord, setHighlightedVerticalWord] = useState([]);

  useEffect(() => {
    // Use something better than a map
    crossword.rows.map(function(row_arr, r) {
      horizontalWords[r] = horizontalWords[r] || "";
      row_arr.map(function(item, c) {
        verticalWords[c] = verticalWords[c] || "";
        verticalWords[c] += item;
        horizontalWords[r] += item;
      })
    })

    setHorizontalMap(horizontalWords);
    setVerticalMap(verticalWords);
  }, [])

  const verticalWords = {}
  const horizontalWords = {}

  const click = () => {
    console.log(crossword.rows)
  }

  const highlightWord = (e) => {
    let row_number = parseInt(e.target.attributes.getNamedItem("row").value);
    let horizontalWord = horizontalMap[row_number];
    let horizontalHightlight = [];
    if (horizontalWord.indexOf(' ') < 0) {
      for (var i = 0; i < horizontalWord.length; i++) {
        horizontalHightlight.push({ row: row_number, column: i})
      }
    }
    let column_number = parseInt(e.target.attributes.getNamedItem("column").value);
    let verticalWord = verticalMap[column_number];
    let verticalHightlight = [];
    if (verticalWord.indexOf(' ') < 0) {
      for (var i = 0; i < verticalWord.length; i++) {
        verticalHightlight.push({ row: i, column: column_number})
      }
    }
    setHighlightedHorizontalWord(horizontalHightlight);
    setHighlightedVerticalWord(verticalHightlight);
  }
  const createSquares = crossword.rows.map(function(row_arr, r) {
    horizontalWords[r] = horizontalWords[r] || "";
    return row_arr.map(function(item, c) {
      verticalWords[c] = verticalWords[c] || "";
      if (item == " ") {
        verticalWords[c] += item;
        horizontalWords[r] += item;
        return <div className="blank-square" row={r} column={c} ></div>;
      } else {
        verticalWords[c] += item;
        horizontalWords[r] += item;
        let isHighlightHorizontal;
        for (let item of highlightedHorizontalWord) {
          if (item["row"] == r && item["column"] == c) {
            isHighlightHorizontal = true;
            break;
          }
        }
        let isHighlightVertical;
        for (let item of highlightedVerticalWord) {
          if (item["row"] == r && item["column"] == c) {
            isHighlightVertical = true;
            break;
          }
        }
        return (
          <Link href={"/?row=" + r}>
            <div className={"crossword-square " + (isHighlightVertical ? 'vertical-highlight ' : ' ') + (isHighlightHorizontal ? 'horizontal-highlight' : '')} row={r} column={c} onClick={highlightWord} onMouseEnter={highlightWord}></div>
          </Link>
        )  
      }
    })
  })
  return(
  <div>
    {router.query.row && (
      <Modal
        onClose={() => {
          router.push("/");
        }}
      >
        <div className="box">
        </div>
      </Modal>
    )}
    <div className="container">
      {createSquares}
    </div>
  </div>
)};

export default Crossword;