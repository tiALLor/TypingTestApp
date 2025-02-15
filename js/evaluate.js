import { checkWordIndex } from "./timer.js";

/**
 * Evaluation of input string from typing field
 */
export function evaluateInput(arr, typingElem) {
  let word = arr.wordsArr[checkWordIndex].word;
  word = word + " ";
  const wordElem = document.querySelector(
    `[data-arr-index="${checkWordIndex}"]`
  );
  // evaluate the input
  const inputStr = typingElem.value;
  resetCharEval(wordElem, word.length);
  inputStr.split("").map((letter, wordIndex) => {
    if (letter === word[wordIndex]) {
      wordElem
        .querySelector(`[data-word-index="${wordIndex}"]`)
        .classList.add("correct");
    } else {
      if (wordIndex < word.length) {
        wordElem
          .querySelector(`[data-word-index="${wordIndex}"]`)
          .classList.add("wrong");
      }
    }
  });
  if (inputStr.length > word.length) {
    wordElem
      .querySelector(`[data-word-index="${word.length - 1}"]`)
      .classList.add("wrong");
  }
}

/**
 * Resets temporary evaluation of written character
 */
function resetCharEval(wordElement, wordLength) {
  for (let wordIndex = 0; wordIndex < wordLength; wordIndex++) {
    const element = wordElement.querySelector(
      `[data-word-index="${wordIndex}"]`
    );
    if (element) {
      element.classList.remove("correct");
      element.classList.remove("wrong");
    }
  }
}
