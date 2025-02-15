import { WordsArr, getWords } from "./words.js";
import { History, renderHistory, renderResults } from "./history.js";
import {
  restart,
} from "./timer.js";
import { handleKeyUp, handleTypingKeyUp } from "./handlers.js";

export var words;
export var history;

/**
 * Event Listeners
 */

document.addEventListener("DOMContentLoaded", async () => {
  const textElem = document.getElementById("text-field");
  const typingElem = document.getElementById("typing-field");
  const timeElem = document.getElementById("timer");
  const wpmElem = document.getElementById("wpm");
  const accuracyElem = document.getElementById("accur-perc");
  const historyElem = document.getElementById("history");
  const resultsElem = document.getElementById("results");

  // object instantiation
  history = new History();
  history.loadData();
  renderHistory(history.createTable(), historyElem);
  words = new WordsArr();
  await getWords(words);
  // console.log(words.wordsArr);
  words.renderWords(textElem);

  document.addEventListener("keyup", async (event) =>
    handleKeyUp(
      event,
      words,
      textElem,
      typingElem,
      timeElem,
      wpmElem,
      accuracyElem,
      resultsElem,
      history,
      historyElem
    )
  );

  document.getElementById("reset").addEventListener("click", () => {
    restart(words, textElem, typingElem, timeElem, wpmElem, accuracyElem);
  });

  document.getElementById("restart").addEventListener("click", async () => {
    await getWords(words);
    restart(words, textElem, typingElem, timeElem, wpmElem, accuracyElem);
  });

  document.getElementById("history-reset").addEventListener("click", () => {
    history.clearHistory();
    renderHistory(history.createTable(), historyElem);
  });

  typingElem.addEventListener("keyup", (event) =>
    handleTypingKeyUp(
      event,
      words,
      typingElem,
      timeElem,
      wpmElem,
      accuracyElem,
      resultsElem,
      history,
      historyElem
    )
  );
});
// import { WordsArr, getWords } from "./words.js";
// import { releaseElement, installElement } from "./elements.js";
// import { History, renderHistory, renderResults } from "./history.js";
// import {
//   startTimer,
//   restart,
//   incrementWordIndex,
//   disabledTyping,
//   timerTyping,
//   checkWordIndex,
//   startTime,
// } from "./timer.js";
// import { evaluateInput } from "./evaluate.js";

// export var words;
// export var history;

// /**
//  * Event Listeners
//  */

// document.addEventListener("DOMContentLoaded", async () => {
//   const textElem = document.getElementById("text-field");
//   const typingElem = document.getElementById("typing-field");
//   const timeElem = document.getElementById("timer");
//   const wpmElem = document.getElementById("wpm");
//   const accuracyElem = document.getElementById("accur-perc");
//   const historyElem = document.getElementById("history");
//   const resultsElem = document.getElementById("results");

//   // object instantiation
//   history = new History();
//   history.loadData();
//   renderHistory(history.createTable(), historyElem);
//   words = new WordsArr();
//   await getWords(words);
//   // console.log(words.wordsArr);
//   words.renderWords(textElem);

//   document.addEventListener("keyup", async (event) => {
//     if (event.key === "Enter") {
//       // restart with current words array
//       restart(
//         words,
//         textElem,
//         typingElem,
//         timeElem,
//         wpmElem,
//         accuracyElem,
//         resultsElem
//       );
//     } else if (event.key === "Escape") {
//       // load new words array
//       await getWords(words);
//       restart(
//         words,
//         textElem,
//         typingElem,
//         timeElem,
//         wpmElem,
//         accuracyElem,
//         resultsElem
//       );
//     }
//   });

//   document.getElementById("reset").addEventListener("click", () => {
//     restart(words, textElem, typingElem, timeElem, wpmElem, accuracyElem);
//   });

//   document.getElementById("restart").addEventListener("click", async () => {
//     await getWords(words);
//     restart(words, textElem, typingElem, timeElem, wpmElem, accuracyElem);
//   });

//   document.getElementById("history-reset").addEventListener("click", () => {
//     history.clearHistory();
//     renderHistory(history.createTable(), historyElem);
//   });

//   typingElem.addEventListener("keyup", (event) => {
//     if (event.key === " " && timerTyping && typingElem.value) {
//       // test is in progress and space is hit
//       // const arrIndex = checkWordIndex;
//       releaseElement(
//         words,
//         checkWordIndex,
//         typingElem,
//         wpmElem,
//         accuracyElem,
//         startTime
//       );
//       incrementWordIndex(words.wordsArr.length);
//       // initialize new element with incremented value
//       installElement(words, checkWordIndex);
//       typingElem.value = "";
//     } else if (event.key === " " && !timerTyping) {
//       // space is hit test not in progress
//       // set the start Index
//       // checkWordIndex = 0;
//       startTimer(
//         words,
//         typingElem,
//         timeElem,
//         wpmElem,
//         history,
//         historyElem,
//         resultsElem
//       );
//       typingElem.value = ""; // Erase the typing element
//     } else {
//       if (!disabledTyping && !timerTyping) {
//         // set the start Index
//         // checkWordIndex = 0;
//         startTimer(
//           words,
//           typingElem,
//           timeElem,
//           wpmElem,
//           history,
//           historyElem,
//           resultsElem
//         );
//         installElement(words, checkWordIndex);
//       }
//       // shall be executed if the key !space
//       evaluateInput(words, typingElem);
//     }
//   });
// });
