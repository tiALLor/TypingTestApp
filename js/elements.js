import {
    renderValue,
  } from "./ui.js";

function releaseElement(
  arr,
  arrIndex,
  typingElem,
  wpmElem,
  accuracyElem,
  startTime
) {
  const element = document.querySelector(`[data-arr-index="${arrIndex}"]`);
  let resultCls;
  let word = arr.wordsArr[arrIndex].word;
  word = word + " ";
  const inputStr = typingElem.value;
  // if (errorCount > 0 || word !== inputStr) {
  if (word !== inputStr) {
    arr.wrongCount += 1;
    // errorCount = 0;
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
  const element = document.querySelector(`[data-arr-index="${arrIndex}"]`);
  // set counter
  //   errorCount = 0;
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

export { releaseElement, installElement };
