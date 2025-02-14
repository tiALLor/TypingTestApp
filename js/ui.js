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

function renderValue(element, value) {
  element.textContent = `${value}`;
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

export { lockedInputField, incrementWordIndex, renderValue, resetCharEval };
