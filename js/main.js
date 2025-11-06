import { WordsArr, getWords } from "./words.js";
import { History, renderHistory, renderResults } from "./history.js";
import { restart } from "./timer.js";
import { handleKeyUp, handleTypingKeyUp } from "./handlers.js";

// export var words;
// export var history;

// Context will hold all states and elements
export const appContext = {};

/**
 * Event Listeners
 */

document.addEventListener("DOMContentLoaded", async () => {
  const elements = {
    textElem: document.getElementById("text-field"),
    typingElem: document.getElementById("typing-field"),
    timeElem: document.getElementById("timer"),
    wpmElem: document.getElementById("wpm"),
    accuracyElem: document.getElementById("accur-perc"),
    historyElem: document.getElementById("history"),
    resultsElem: document.getElementById("results"),
  };

  const state = {
    history: new History(),
    words: new WordsArr(),
  };

  Object.assign(appContext, elements, state);

  // const textElem = document.getElementById("text-field");
  // const typingElem = document.getElementById("typing-field");
  // const timeElem = document.getElementById("timer");
  // const wpmElem = document.getElementById("wpm");
  // const accuracyElem = document.getElementById("accur-perc");
  // const historyElem = document.getElementById("history");
  // const resultsElem = document.getElementById("results");

  // object instantiation
  // history = new History();
  appContext.history.loadData();
  renderHistory(appContext.history.createTable(), appContext.historyElem);
  // words = new WordsArr();
  await getWords(appContext.words);
  // console.log(words.wordsArr);
  appContext.words.renderWords(appContext.textElem);

  document.addEventListener("keyup", async (event) =>
    handleKeyUp(event, appContext)
  );

  document.getElementById("reset").addEventListener("click", () => {
    restart(appContext);
    appContext.typingElem.focus();
  });

  document.getElementById("restart").addEventListener("click", async () => {
    await getWords(appContext.words);
    restart(appContext);
    appContext.typingElem.focus();
  });

  document.getElementById("history-reset").addEventListener("click", () => {
    appContext.history.clearHistory();
    renderHistory(appContext.history.createTable(), appContext.historyElem);
  });

  appContext.typingElem.addEventListener("keyup", (event) =>
    handleTypingKeyUp(event, appContext)
  );
});
