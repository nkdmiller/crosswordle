import { useRef } from 'react'
import { Dialog } from '@headlessui/react'
import Link from "next/link";
import Board from './Board';

const Modal = ({ onClose = () => {}, words, wordMap, handleAttempt }) => {
  let overlayRef = useRef();

  //Get the word based on the row and column query params
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
      className="modal-container"
    >
      <Dialog.Overlay
        ref={overlayRef}
        className="modal-overlay"
      />
      <div className="modal-background">
        <div className="box">
          <div className="exit">
            <Link href="/">X</Link>
          </div>
          <Board word={word} handleAttempt={handleAttempt} />
        </div>
      </div>
    </Dialog>
)};

export default Modal;