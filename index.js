const billInputElement = document.getElementById('bill__input');
const headCountElement = document.getElementById('headcount__input');
const tipInputButtons = document.querySelectorAll('.fix__input');
const tipInputManualElement = document.querySelector('.custom__input');
const tipInputElementsAll = document.querySelectorAll('.tip__input');
const totalOutputElement = document.getElementById('total-output');
const tipOutputElement = document.getElementById('person-output');
const errorMessage = document.querySelector('.error-message');
const resetButton = document.querySelector('.reset__button');

function validateBillInput(e) {
  const value = e.target.value;
  const inputCharacter = e.data;

  if (
    isAllowedCharacter(inputCharacter) &&
    isAllowedDotInput(value, inputCharacter)
  ) {
    return;
  }

  e.preventDefault();
}

function validateNumberInput(e) {
  const inputCharacter = e.data;
  const regex = /^[0-9]$/;

  if (!inputCharacter || regex.test(inputCharacter)) {
    return;
  }

  e.preventDefault();
}

function isAllowedCharacter(char) {
  //check if user hits DEL / BACKSPACE etc.
  if (!char) {
    return true;
  }

  const regex = /^[0-9.]$/;
  return regex.test(char);
}

function isAllowedDotInput(value, inputChar) {
  const regex = /[0-9]/;
  if (inputChar !== '.') {
    return true;
  }

  if (!value || !regex.test(value[0]) || value.includes('.')) {
    return false;
  }

  return true;
}

function unselectAllTipInputs() {
  tipInputElementsAll.forEach((element) => {
    element.dataset.selected = false;
  });
}

function clearCustomInput() {
  tipInputManualElement.value = '';
}

function getTipInputValue() {
  const selectedTipInput = Array.from(tipInputElementsAll).find(
    (element) => element.dataset.selected === 'true'
  );

  return selectedTipInput.dataset.value;
}

function isAllDataFilled() {
  const selectedTipInput = Array.from(tipInputElementsAll).find(
    (element) => element.dataset.selected === 'true'
  );

  if (
    !billInputElement.value ||
    !headCountElement.value ||
    !selectedTipInput.value
  ) {
    return false;
  } else {
    return true;
  }
}

function calculateOutput() {
  const bill = Number(billInputElement.value);
  const tip = Number(getTipInputValue()) / 100;
  const headCount = Number(headCountElement.value);
  const resultTotal = ((bill + bill * tip) / headCount).toFixed(2);
  const resultTip = ((bill * tip) / headCount).toFixed(2);

  return {
    tip: resultTip,
    total: resultTotal,
  };
}

function drawOutputValues(totalValue, tipValue) {
  totalOutputElement.innerText = totalValue;
  tipOutputElement.innerText = tipValue;
}

function setError() {
  headCountElement.classList.add('error');
  errorMessage.classList.remove('hidden');
}

function removeError() {
  headCountElement.classList.remove('error');
  errorMessage.classList.add('hidden');
}

function truncateLeadingZero(value) {
  if (!value || value === '0') {
    return;
  }
  return Number(value);
}

function setAppStateToDefault() {
  billInputElement.value = '';
  headCountElement.value = '';
  clearCustomInput();
  unselectAllTipInputs();
  tipInputElementsAll[0].dataset.selected = 'true';
  drawOutputValues('0.00', '0.00');
}

billInputElement.addEventListener('beforeinput', validateBillInput);
headCountElement.addEventListener('beforeinput', validateNumberInput);
tipInputManualElement.addEventListener('beforeinput', validateNumberInput);
tipInputElementsAll.forEach((element) => {
  element.addEventListener('click', (e) => {
    unselectAllTipInputs();
    e.target.dataset.selected = true;

    if (isAllDataFilled()) {
      const result = calculateOutput();
      drawOutputValues(result.total, result.tip);
    }
  });
});

tipInputButtons.forEach((element) => {
  element.addEventListener('click', () => clearCustomInput());
});

tipInputManualElement.addEventListener('blur', (e) => {
  if (!e.target.value) {
    e.target.value = 0;
    e.target.dataset.value = 0;
  }

  if (e.target.value && e.target.value !== '0') {
    const truncatedValue = truncateLeadingZero(e.target.value);
    e.target.value = truncatedValue;
    e.dataset.value = truncatedValue;
  }

  if (isAllDataFilled()) {
    const result = calculateOutput();
    drawOutputValues(result.total, result.tip);
  }
});

tipInputManualElement.addEventListener('input', (e) => {
  e.target.dataset.value = e.target.value;

  if (isAllDataFilled()) {
    const result = calculateOutput();
    drawOutputValues(result.total, result.tip);
  }
});

[billInputElement, headCountElement].forEach((element) => {
  element.addEventListener('input', () => {
    if (headCountElement.value === '0') {
      setError();
      drawOutputValues('0.00', '0.00');
      return;
    }

    if (headCountElement.value !== '0') {
      removeError();
    }

    if (isAllDataFilled()) {
      removeError();
      const result = calculateOutput();
      drawOutputValues(result.total, result.tip);
    }
  });
});

[billInputElement, headCountElement].forEach((element) => {
  element.addEventListener('blur', (e) => {
    const value = e.target.value;
    if (value && value !== '0') {
      e.target.value = truncateLeadingZero(e.target.value);
    }

    if (headCountElement.value !== '0') {
      removeError();
    }
  });
});

resetButton.addEventListener('click', () => {
  setAppStateToDefault();
});
