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