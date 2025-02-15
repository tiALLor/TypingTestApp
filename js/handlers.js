import { WordsArr, getWords } from "./words.js";
import { releaseElement, installElement } from "./elements.js";
import { History, renderHistory, renderResults } from "./history.js";
import {
  startTimer,
  restart,
  incrementWordIndex,
  disabledTyping,
  timerTyping,
  checkWordIndex,
  startTime,
} from "./timer.js";

import { evaluateInput } from "./evaluate.js";

/**
 * Event handler keyup "Enter", "Escape"
 */
export function handleKeyUp(
  event,
  words,
  textElem,
  typingElem,
  timeElem,
  wpmElem,
  accuracyElem,
  resultsElem
) {
  if (event.key === "Enter") {
    // restart with current words array
    restart(
      words,
      textElem,
      typingElem,
      timeElem,
      wpmElem,
      accuracyElem,
      resultsElem
    );
  } else if (event.key === "Escape") {
    // load new words array
    getWords(words).then(() =>
      restart(
        words,
        textElem,
        typingElem,
        timeElem,
        wpmElem,
        accuracyElem,
        resultsElem
      )
    );
  }
}
/**
 * Event handler Typing field
 */
export function handleTypingKeyUp(
  event,
  words,
  typingElem,
  timeElem,
  wpmElem,
  accuracyElem,
  resultsElem,
  history,
  historyElem
) {
  if (event.key === " " && timerTyping && typingElem.value) {
    // test is in progress and space is hit
    // const arrIndex = checkWordIndex;
    releaseElement(
      words,
      checkWordIndex,
      typingElem,
      wpmElem,
      accuracyElem,
      startTime
    );
    incrementWordIndex(words.wordsArr.length);
    // initialize new element with incremented value
    installElement(words, checkWordIndex);
    typingElem.value = "";
  } else if (event.key === " " && !timerTyping) {
    // space is hit test not in progress
    startTimer(
      words,
      typingElem,
      timeElem,
      wpmElem,
      history,
      historyElem,
      resultsElem
    );
    typingElem.value = ""; // Erase the typing element
  } else {
    if (!disabledTyping && !timerTyping) {
      startTimer(
        words,
        typingElem,
        timeElem,
        wpmElem,
        history,
        historyElem,
        resultsElem
      );
      installElement(words, checkWordIndex);
    }
    // shall be executed if the key !space
    evaluateInput(words, typingElem);
  }
}
