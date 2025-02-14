import { WordsArr, getWords } from "./words.js";
import {
  lockedInputField,
  incrementWordIndex,
  renderValue,
  resetCharEval,
} from "./ui.js";
import { releaseElement, installElement } from "./elements.js";
import { History, renderHistory } from "./history.js";

var words;
var history;
var disabledTyping = false;
var timerTyping;
let checkWordIndex;
let startTime;
let countdownTyping;

function startTimer(
  arr,
  typingElem,
  timeElem,
  wpmElem,
  history,
  historyElement
) {
  const duration = 60;
  let timeLeft = duration;
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
    // save result to history
    history.saveResults(arr.correctCount, `${arr.calculateAccuracy()} %`);
    renderHistory(history.createTable(), historyElement);
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
function restart(arr, textElem, typingElem, timeElem, wpmElem, accuracyElem) {
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
}

/**
 * Evaluation of input string from typing field
 */
function evaluateInput(arr, typingElem) {
  var word = arr.wordsArr[checkWordIndex].word;
  word = word + " ";
  const wordElement = document.querySelector(
    `[data-arr-index="${checkWordIndex}"]`
  );
  // evaluate the input
  const inputStr = typingElem.value;
  resetCharEval(wordElement, word.length);
  inputStr.split("").map((letter, wordIndex) => {
    if (letter === word[wordIndex]) {
      wordElement
        .querySelector(`[data-word-index="${wordIndex}"]`)
        .classList.add("correct");
    } else {
      if (wordIndex < word.length) {
        wordElement
          .querySelector(`[data-word-index="${wordIndex}"]`)
          .classList.add("wrong");
      }
    }
  });
  if (inputStr.length > word.length) {
    wordElement
      .querySelector(`[data-word-index="${word.length - 1}"]`)
      .classList.add("wrong");
  }
}

/**
 * Event Listeners
 */

document.addEventListener("DOMContentLoaded", async () => {
  const textElem = document.getElementById("text-field");
  const typingElem = document.getElementById("typing-field");
  const timeElem = document.getElementById("timer");
  const wpmElem = document.getElementById("wpm");
  const accuracyElem = document.getElementById("accur-perc");
  const historyElement = document.getElementById("history");

  // object instantiation
  history = new History();
  history.loadData();
  renderHistory(history.createTable(), historyElement);
  words = new WordsArr();
  await getWords(words);
  // console.log(words.wordsArr);
  words.renderWords(textElem);

  document.addEventListener("keyup", async (event) => {
    if (event.key === "Enter") {
      // restart with current words array
      restart(words, textElem, typingElem, timeElem, wpmElem, accuracyElem);
    } else if (event.key === "Escape") {
      // load new words array
      await getWords(words);
      restart(words, textElem, typingElem, timeElem, wpmElem, accuracyElem);
    }
  });

  document.getElementById("reset").addEventListener("click", () => {
    restart(words, textElem, typingElem, timeElem, wpmElem, accuracyElem);
  });

  document.getElementById("restart").addEventListener("click", async () => {
    await getWords(words);
    restart(words, textElem, typingElem, timeElem, wpmElem, accuracyElem);
  });

  document.getElementById("history-reset").addEventListener("click", () => {
    history.clearHistory();
    renderHistory(history.createTable(), historyElement);
  });

  typingElem.addEventListener("keyup", (event) => {
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
      checkWordIndex = incrementWordIndex(
        checkWordIndex,
        words.wordsArr.length
      );
      // initialize new element with incremented value
      installElement(words, checkWordIndex);
      typingElem.value = "";
    } else if (event.key === " " && !timerTyping) {
      // space is hit test not in progress
      // set the start Index
      checkWordIndex = 0;
      startTimer(words, typingElem, timeElem, wpmElem, history, historyElement);
      typingElem.value = ""; // Erase the typing element
    } else {
      if (!disabledTyping && !timerTyping) {
        // set the start Index
        checkWordIndex = 0;
        startTimer(
          words,
          typingElem,
          timeElem,
          wpmElem,
          history,
          historyElement
        );
        installElement(words, checkWordIndex);
      }
      // shall be executed if the key !space
      evaluateInput(words, typingElem);
    }
  });
});
