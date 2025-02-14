let text = [];
var words;
var disabledTyping = false;
var timerTyping;
let checkWordIndex;
let startTime;
let errorCount = 0;

class WordsArr {
  constructor() {
    //original fetched text, for reset
    this.origArr = [];
    // Arr of Word obj
    this.wordsArr = [];
    // Parameters
    this.correctCount = 0;
    this.wrongCount = 0;
    this.actTimeStamp = 0;
  }

  createWordsArr() {
    this.wordsArr = [];
    this.correctCount = 0;
    this.wrongCount = 0;
    this.actTimeStamp = 0; // in ms
    this.wordsArr = this.origArr.map((word) => new Word(word));
  }

  renderWords(textFieldElement) {
    textFieldElement.innerHTML = ""; // clear the element before rendering
    this.wordsArr.forEach((objWord, arrIndex) => {
      const wordElement = document.createElement("span");
      wordElement.dataset.arrIndex = arrIndex;
      wordElement.innerText = `${objWord.word} `;
      textFieldElement.appendChild(wordElement);
    });
  }

  calculateWPM() {
    if (this.actTimeStamp > 0) {
      const value = Math.round(this.correctCount / (this.actTimeStamp / 1000) * 60);
      return value;
    } else {
      return 0;
    }
  }

  calculateAccuracy() {
    if (this.correctCount + this.wrongCount === 0) {
      return 0;
    } else {
      const value =
        Math.round(
          (this.correctCount * 10000) / (this.correctCount + this.wrongCount)
        ) / 100;
      return value;
    }
  }
}

class Word {
  constructor(word) {
    this.word = word;
    this.isCorrect = "";
  }
}

async function getData() {
  const url = "https://poetrydb.org/linecount,random/30;1";
  //following line has a failure, its for testing:
  // const url = "https://poetrydb.org/linecount,random,poemcount/20;1";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function getText(length) {
  for (let i = 0; i < 10; i++) {
    const data = await getData();
    try {
      if (data.status) {
        throw new Error(`Response status: ${data.status} ${data.reason}`);
      } else {
        if (!data[0] || !data[0].lines) {
          throw new Error("Invalid data format");
        }
        const lines = await data[0]["lines"];
        let textStr = lines.join(" ");
        // console.log(textStr);
        textStr = textStr.trim();
        textStr = textStr.replace(/\s{2,}/g, " ");
        textStr = textStr.replace(/--/g, "-");
        // console.log(textStr);
        let textArr = textStr.split(" ");
        // console.log(textArr.length);
        // slice the array to 217 words
        if (textArr.length > 217) {
          textArr = textArr.splice(0, 217);
          // console.log(textArr.length);
          return textArr;
        } else if (textArr.length > length) {
          return textArr;
        } else {
          continue;
        }
      }
    } catch (error) {
      console.log(error);
    }
    throw new Error("Attempt to get text with specified length failed");
  }
}

async function getWords() {
  try {
    words.origArr = await getText(150);
    words.createWordsArr();
    return words;
  } catch (error) {
    console.log(error);
  }
}

function lockedInputField(element, value) {
  element.disabled = value;
  if (value === true) {
    element.style.backgroundColor = "lightgrey";
  } else {
    element.style.backgroundColor = "white";
  }
}

function incrementWordIndex(currentIndex, maxIndex) {
  if (currentIndex < maxIndex) {
    currentIndex++;
  }
  return currentIndex;
}

function releaseElement(arr, arrIndex, typingElem, wpmElem, accuracyElem) {
  element = document.querySelector(`[data-arr-index="${arrIndex}"]`);
  let resultCls;
  let word = arr.wordsArr[arrIndex].word;
  word = word + " ";
  const inputStr = typingElem.value;
  // if (errorCount > 0 || word !== inputStr) {
  if (word !== inputStr) {
    arr.wrongCount += 1;
    errorCount = 0;
    resultCls = "wrong";
    arr.wordsArr[arrIndex].isCorrect = false;
  } else if (word === inputStr) {
    arr.correctCount += 1;
    resultCls = "correct";
    arr.wordsArr[arrIndex].isCorrect = true;
  } else {
    console.log("Counter error");
  }
  // set classes
  try {
    element.classList.remove("in-progress");
    element.classList.add(resultCls);
  } catch {
    console.log("in-progress not present");
  }

  // Calculate the elapsed time is ms
  arr.actTimeStamp = Date.now() - startTime;

  // replace working element with arr element
  element.innerHTML = ""; // clear the element content
  element.textContent = `${arr.wordsArr[arrIndex].word} `;

  //render stats
  renderValue(wpmElem, arr.calculateWPM());
  renderValue(accuracyElem, `${arr.calculateAccuracy()} %`);
}

function installElement(arr, arrIndex) {
  element = document.querySelector(`[data-arr-index="${arrIndex}"]`);
  // set counter
  errorCount = 0;
  // set class
  try {
    element.classList.add("in-progress");
  } catch {
    console.log("in-progress not present");
  }
  // replace arr element with working element
  element.innerHTML = ""; // clear the element content
  let word = arr.wordsArr[arrIndex].word;
  word = word + " ";
  word.split("").map((letter, wordIndex) => {
    const letterElement = document.createElement("span");
    letterElement.dataset.wordIndex = wordIndex;
    letterElement.innerText = letter;
    element.appendChild(letterElement);
  });
}

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

function startTimer(arr, typingElem, timeElem, wpmElem) {
  duration = 60;
  timeLeft = duration;
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
  errorCount = 0;
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

function renderValue(element, value) {
  element.textContent = `${value}`;
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
  await getWords();
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
    await getWords();
    restart(words, textElem, typingElem, timeElem, wpmElem, accuracyElem);
  });

  typingElem.addEventListener("keyup", (event) => {
    if (event.key === " " && timerTyping && typingElem.value) {
      // test is in progress and space is hit
      arrIndex = checkWordIndex;
      releaseElement(words, checkWordIndex, typingElem, wpmElem, accuracyElem);
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
      arrIndex = checkWordIndex;
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
      errorCount = 0;
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
            errorCount++;
          }
        }
      });
      if (inputStr.length > word.length) {
        wordElement
          .querySelector(`[data-word-index="${word.length - 1}"]`)
          .classList.add("wrong");
        errorCount++;
      }
    }
  });
});
// #text-field > span:nth-child(1)
