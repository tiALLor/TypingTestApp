import { WordsArr, Word, getWords } from "./words.js";
import {
  lockedInputField,
  incrementWordIndex,
  renderValue,
  resetCharEval,
} from "./ui.js";
import { releaseElement, installElement } from "./elements.js";

// let text = [];
var words;
var disabledTyping = false;
var timerTyping;
let checkWordIndex;
let startTime;

function startTimer(arr, typingElem, timeElem, wpmElem) {
  const duration = 60;
  let timeLeft = duration;
  let countdownTyping;
  //timer
  timerTyping = setTimeout(() => {
    // disable the input field
    disabledTyping === true;
    lockedInputField(typingElem, true);
    alert("Time is up!");
    // releaseElement(words, checkWordIndex, typingElem, wpmElem, accuracyElem);
    clearInterval(countdownTyping);
    renderValue(timeElem, "- -");
    renderValue(wpmElem, arr.correctCount);
  }, duration * 1000);
  startTime = Date.now();
  //visualization
  countdownTyping = setInterval(() => {
    timeLeft--;
    renderValue(timeElem, `${timeLeft - 1} sec.`);
  }, 1000);
}

function restart(arr, textElem, typingElem, timeElem, wpmElem, accuracyElem) {
  // restart with current words array
  arr.createWordsArr();
  arr.renderWords(textElem);
  //clearing the typing field
  typingElem.value = "";
  checkWordIndex = 0;
  disabledTyping = false;
  // cancel the timer
  clearTimeout(timerTyping);
  clearInterval(countdownTyping);
  timerTyping = false;
  // unlock the typing field
  lockedInputField(typingElem, false);
  renderValue(timeElem, "- -");
  renderValue(wpmElem, "");
  renderValue(accuracyElem, "");
}

/*
Event Listeners
*/

document.addEventListener("DOMContentLoaded", async () => {
  const textElem = document.getElementById("text-field");
  const typingElem = document.getElementById("typing-field");
  const timeElem = document.getElementById("timer");
  const wpmElem = document.getElementById("wpm");
  const accuracyElem = document.getElementById("accur-perc");

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
      await getWords();
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
      startTimer(words, typingElem, timeElem, wpmElem);
      typingElem.value = ""; // Erase the typing element
    } else {
      if (!disabledTyping && !timerTyping) {
        // set the start Index
        checkWordIndex = 0;
        startTimer(words, typingElem, timeElem, wpmElem);
        installElement(words, checkWordIndex);
      }
      // shall be executed if the key !space
      const arrIndex = checkWordIndex;
      var word = words.wordsArr[arrIndex].word;
      word = word + " ";
      let isCorrect = words.wordsArr[arrIndex].isCorrect;
      // console.log(word)
      const wordElement = document.querySelector(
        `[data-arr-index="${arrIndex}"]`
      );
      // console.log(wordElement.innerText)

      // evaluate the input
      const inputStr = typingElem.value;
      // console.log(inputStr);
      // console.log(wordElement.innerText);
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
  });
});
