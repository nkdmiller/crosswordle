const Guess = ({ value, guessClass }) => {
  return(
    <div className={guessClass}>
      {value}
    </div>
)};

export default Guess;