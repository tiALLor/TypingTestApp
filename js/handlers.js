import { WordsArr, getWords } from "./words.js";
import { releaseElement, installElement } from "./elements.js";
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
export async function handleKeyUp(event, appContext) {
  if (event.key === "Enter") {
    // restart with current words array
    restart(appContext);
    appContext.typingElem.focus();
  } else if (event.key === "Escape") {
    // load new words array
    await getWords(appContext.words);
    restart(appContext);
    appContext.typingElem.focus();
  }
}
/**
 * Event handler Typing field
 */
export function handleTypingKeyUp(
  event,
  appContext
  // words,
  // typingElem,
  // timeElem,
  // wpmElem,
  // accuracyElem,
  // resultsElem,
  // history,
  // historyElem
) {
  if (event.key === " " && timerTyping && appContext.typingElem.value) {
    // test is in progress and space is hit
    // const arrIndex = checkWordIndex;
    releaseElement(
      appContext.words,
      checkWordIndex,
      appContext.typingElem,
      appContext.wpmElem,
      appContext.accuracyElem,
      startTime
    );
    incrementWordIndex(appContext.words.wordsArr.length);
    // initialize new element with incremented value
    installElement(appContext.words, checkWordIndex);
    appContext.typingElem.value = "";
  } else if (event.key === " " && !timerTyping) {
    // space is hit test not in progress
    startTimer(appContext);
    appContext.typingElem.value = ""; // Erase the typing element
  } else {
    if (!disabledTyping && !timerTyping) {
      startTimer(appContext);
      installElement(appContext.words, checkWordIndex);
    }
    // shall be executed if the key !space
    evaluateInput(appContext.words, appContext.typingElem);
  }
}
