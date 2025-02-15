import { lockedInputField, renderValue } from "./ui.js";
import { History, renderHistory, renderResults } from "./history.js";
import { duration } from "./config.js";

export var disabledTyping = false;
export var timerTyping;
export let checkWordIndex;
export let startTime;
let countdownTyping;

/**
 * Starts the test= timer...
 */
export function startTimer(
  arr,
  typingElem,
  timeElem,
  wpmElem,
  history,
  historyElem,
  resultsElem
) {
  let timeLeft = duration;
  checkWordIndex = 0;
  //timer
  timerTyping = setTimeout(() => {
    // disable the input field
    disabledTyping === true;
    lockedInputField(typingElem, true);
    alert("Time is up! Please check the final results.");
    // releaseElement(words, checkWordIndex, typingElem, wpmElem, accuracyElem);
    clearInterval(countdownTyping);
    renderValue(timeElem, "- -");
    renderValue(wpmElem, arr.correctCount);
    renderResults(resultsElem, arr.correctCount, history.calcAvgWpm());
    // save result to history
    history.saveResults(arr.correctCount, `${arr.calculateAccuracy()} %`);
    renderHistory(history.createTable(), historyElem);
  }, duration * 1000);
  startTime = Date.now();
  // timer visualization
  countdownTyping = setInterval(() => {
    timeLeft--;
    renderValue(timeElem, `${timeLeft - 1} sec.`);
  }, 1000);
}

/**
 * Reinitializes the wordsArr base on data in origArr
 */
export function restart(
  arr,
  textElem,
  typingElem,
  timeElem,
  wpmElem,
  accuracyElem,
  resultsElem
) {
  // restart with current words array
  arr.createWordsArr();
  arr.renderWords(textElem);
  //clearing the typing field and set variables to init value
  typingElem.value = "";
  checkWordIndex = 0;
  disabledTyping = false;
  // cancel timers
  clearTimeout(timerTyping);
  clearInterval(countdownTyping);
  timerTyping = false;
  // unlock the typing field
  lockedInputField(typingElem, false);
  // render initial values
  renderValue(timeElem, "- -");
  renderValue(wpmElem, "");
  renderValue(accuracyElem, "");
  renderValue(resultsElem, "");
}

/**
 * Increments word index
 */
export function incrementWordIndex(maxIndex) {
  if (checkWordIndex < maxIndex) {
    checkWordIndex++;
  }
}
