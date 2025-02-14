export class History {
  constructor() {
    this.date = [];
    this.wpm = [];
    this.accuracy = [];
  }

  /**
   * Saves the history data to localStorage.
   */
  saveData() {
    try {
      const data = {
        date: this.date,
        wpm: this.wpm,
        accuracy: this.accuracy,
      };
      const historyJSON = JSON.stringify(data);
      console.log("Saving history data:", historyJSON);
      localStorage.setItem("history", historyJSON);
    } catch (error) {
      console.error(`Error saving data: ${error.message}`);
    }
  }

  /**
   * Loads the history data from localStorage.
   */
  loadData() {
    try {
      const txtData = localStorage.getItem("history");
      if (txtData) {
        const data = JSON.parse(txtData);
        this.date = data.date;
        this.wpm = data.wpm;
        this.accuracy = data.accuracy;
      } else {
        console.warn("No history data found in localStorage.");
      }
    } catch (error) {
      console.log(`Error: ${error}!`);
    }
  }
  /**
   * Clears history data and history in localStorage.
   */
  clearHistory() {
    this.date.length = 0;
    this.wpm.length = 0;
    this.accuracy.length = 0;
    this.saveData();
    console.log("History data cleared.");
  }
  /**
   * Saves data to history and local storage
   */
  saveResults(wpm, accuracy) {
    let now = new Date();
    let formattedDate =
      now.getFullYear() +
      "-" +
      (now.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      now.getDate().toString().padStart(2, "0") +
      " " +
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0") +
      ":" +
      now.getSeconds().toString().padStart(2, "0");
    this.date.unshift(formattedDate);
    this.wpm.unshift(wpm);
    this.accuracy.unshift(accuracy);
    console.log(`Logged data: ${formattedDate}, ${wpm}, ${accuracy}`);
    this.saveData();
  }
  /**
   * Created array of historical parameters to be rendered as table
   */
  createTable() {
    if (
      this.date.length === this.wpm.length &&
      this.wpm.length === this.accuracy.length
    ) {
      const sizeRows = this.date.length;
      const table = [];
      const header = ["DATE", "WPM", "ACCURACY"];
      table.push(header);
      for (let rowIndex = 0; rowIndex < sizeRows; rowIndex++) {
        const row = [
          this.date[rowIndex],
          this.wpm[rowIndex],
          this.accuracy[rowIndex],
        ];
        table.push(row);
      }
      return table;
    } else {
      console.log("History records are corrupt");
    }
  }
  /**
   * Calculate avg value of WPS from historical data
   */
  calcAvgWpm() {
    let sum = this.wpm.reduce((accumulator, value) => accumulator + value, 0);
    return Math.round(sum / this.wpm.length);
  }
}

/**
 * Renders historical parameters as a table base o array data
 */
export function renderHistory(historyTable, historyElement) {
  historyElement.innerHTML = ""; // Clear the boardElement before rendering
  historyTable.forEach((row, rowIndex) => {
    const rowElement = document.createElement("tr");
    row.forEach((cell, colIndex) => {
      const cellElement = document.createElement("td");
      cellElement.classList.add("cell");
      cellElement.dataset.row = rowIndex;
      cellElement.dataset.col = colIndex;
      cellElement.textContent = cell;
      rowElement.appendChild(cellElement);
    });
    historyElement.appendChild(rowElement);
  });
}

export function renderResults(resultsElem, actWpm, avgWpm) {
  let msg;
  if (actWpm > avgWpm) {
    msg = `Your test result is ${actWpm} WPM, you have improved (avg ${avgWpm} WPM)!`;
  } else if ((actWpm === avgWpm)) {
    msg = `Your test result is ${actWpm} WPM, good result (avg ${avgWpm} WPM)!`;
  } else if (actWpm < avgWpm) {
    msg = `Your test result is ${actWpm} WPM, you scored bellow avg. (avg ${avgWpm} WPM)!`;
  } else {
    msg = `Your test result is ${actWpm} WPM!`;
  }
  resultsElem.textContent = msg;
}
