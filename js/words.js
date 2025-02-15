/**
 * Class for storing text for test and its test results
 */
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
      const value = Math.round(
        (this.correctCount / (this.actTimeStamp / 1000)) * 60
      );
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

/**
 * Object for text word
 */
class Word {
  constructor(word) {
    this.word = word;
    this.isCorrect = "";
  }
}

/**
 * Fetch data from API
 */
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

/**
 * Evaluation of fetched data, manipulation with them
 */
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
        textStr = textStr.trim();
        textStr = textStr.replace(/\s{2,}/g, " ");
        textStr = textStr.replace(/--/g, "-");
        let textArr = textStr.split(" ");
        // slice the array to 217 words
        if (textArr.length > 217) {
          textArr = textArr.splice(0, 217);
          return textArr;
        } else if (textArr.length > length) {
          return textArr;
        } else {
          continue;
        }
      }
    } catch (error) {
      console.log(error);
      return ["Attempt to get text from server failed!"];
    }
  }
  throw new Error("Attempt to get text with specified length failed!");
}
/**
 * Requests string and creates array of word objects
 */
async function getWords(arrWords) {
  try {
    arrWords.origArr = await getText(150);
    arrWords.createWordsArr();
    return arrWords;
  } catch (error) {
    console.log(error);
  }
}

export { WordsArr, Word, getWords };
