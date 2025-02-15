/**
 * Renders a value to the specified element.
 */
export function lockedInputField(element, value) {
  element.disabled = value;
  if (value === true) {
    element.style.backgroundColor = "lightgrey";
  } else {
    element.style.backgroundColor = "";
  }
}

/**
 * Renders test parameter
 */
export function renderValue(element, value) {
  element.textContent = `${value}`;
}
