import { useState, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import Link from "next/link";
import Board from './board';

const Modal = ({ onClose = () => {}, words, wordMap, handleAttempt }) => {
  let overlayRef = useRef();
  const queryParams = new URLSearchParams(window.location.search)
  const row = queryParams.get("row");
  const column = queryParams.get("column");
  const wordNumber = wordMap[row][column][0];
  const word = words.find(w => {
    return wordNumber == w.number;
  });


  return(
    <Dialog
      static
      open={true}
      onClose={onClose}
      initialFocus={overlayRef}
      className="fixed inset-0 z-10 flex items-center justify-center"
    >
      <Dialog.Overlay
        ref={overlayRef}
        className="fixed inset-0 bg-gray-800/60"
      />
      <div className="relative flex items-center justify-center w-1/2">
        <div className="box">
          <Link href="/">X</Link>
          <Board word={word} handleAttempt={handleAttempt} />
        </div>
      </div>
    </Dialog>
)};

export default Modal;