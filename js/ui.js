/**
 * Renders a value to the specified element.
 */
function lockedInputField(element, value) {
  element.disabled = value;
  if (value === true) {
    element.style.backgroundColor = "lightgrey";
  } else {
    element.style.backgroundColor = "";
  }
}

/**
 * Increments word index
 */
function incrementWordIndex(currentIndex, maxIndex) {
  if (currentIndex < maxIndex) {
    currentIndex++;
  }
  return currentIndex;
}

/**
 * Renders test parameter
 */
function renderValue(element, value) {
  element.textContent = `${value}`;
}

/**
 * Resets temporary evaluation of written character
 */
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

export { lockedInputField, incrementWordIndex, renderValue, resetCharEval };
