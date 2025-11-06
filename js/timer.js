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
  appContext
  // arr,
  // typingElem,
  // timeElem,
  // wpmElem,
  // history,
  // historyElem,
  // resultsElem
) {
  let timeLeft = duration;
  checkWordIndex = 0;
  //timer
  timerTyping = setTimeout(() => {
    // disable the input field
    disabledTyping === true;
    lockedInputField(appContext.typingElem, true);
    alert("Time is up! Please check the final results.");
    // releaseElement(words, checkWordIndex, typingElem, wpmElem, accuracyElem);
    clearInterval(countdownTyping);
    renderValue(appContext.timeElem, "- -");
    renderValue(appContext.wpmElem, appContext.words.correctCount);
    renderResults(
      appContext.resultsElem,
      appContext.words.correctCount,
      appContext.history.calcAvgWpm()
    );
    // save result to history
    appContext.history.saveResults(
      appContext.words.correctCount,
      `${appContext.words.calculateAccuracy()} %`
    );
    renderHistory(appContext.history.createTable(), appContext.historyElem);
  }, duration * 1000);
  startTime = Date.now();
  // timer visualization
  countdownTyping = setInterval(() => {
    timeLeft--;
    renderValue(appContext.timeElem, `${timeLeft - 1} sec.`);
  }, 1000);
}

/**
 * Reinitializes the wordsArr base on data in origArr
 */
export function restart(
  appContext
  // arr,
  // textElem,
  // typingElem,
  // timeElem,
  // wpmElem,
  // accuracyElem,
  // resultsElem
) {
  // restart with current words array
  appContext.words.createWordsArr();
  appContext.words.renderWords(appContext.textElem);
  //clearing the typing field and set variables to init value
  appContext.typingElem.value = "";
  checkWordIndex = 0;
  disabledTyping = false;
  // cancel timers
  clearTimeout(timerTyping);
  clearInterval(countdownTyping);
  timerTyping = false;
  // unlock the typing field
  lockedInputField(appContext.typingElem, false);
  // render initial values
  renderValue(appContext.timeElem, "- -");
  renderValue(appContext.wpmElem, "");
  renderValue(appContext.accuracyElem, "");
  renderValue(appContext.resultsElem, "");
}

/**
 * Increments word index
 */
export function incrementWordIndex(maxIndex) {
  if (checkWordIndex < maxIndex) {
    checkWordIndex++;
  }
}
