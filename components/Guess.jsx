import { useState, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import Link from "next/link";

const Guess = ({ value, guessClass }) => {
  return(
    <div className={guessClass}>
      {value}
    </div>
)};

export default Guess;