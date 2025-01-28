const billInputElement = document.getElementById('bill__input');
const headCountElement = document.getElementById('headcount__input');
const tipInputButtons = document.querySelectorAll('.fix__input');
const tipInputManualElement = document.querySelector('.custom__input');
const tipInputElementsAll = document.querySelectorAll('.tip__input');
const totalOutputElement = document.getElementById('total-output');
const tipOutputElement = document.getElementById('person-output');

const allInputElements = [
  billInputElement,
  headCountElement,
  [...tipInputElementsAll],
];

let billInputValue;
let tipInputValue;
let headCountInputValue;

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

function calculateTotal() {
  const bill = Number(billInputElement.value);
  const tip = Number(getTipInputValue()) / 100;
  const headCount = Number(headCountElement.value);
  const result = (bill + bill * tip) / headCount;

  return result.toFixed(2);
}

function calculateTip() {
  const bill = Number(billInputElement.value);
  const tip = Number(getTipInputValue()) / 100;
  const headCount = Number(headCountElement.value);
  const result = (bill * tip) / headCount;

  return result.toFixed(2);
}

function drawOutputValues(totalValue, tipValue) {
  totalOutputElement.innerText = totalValue;
  tipOutputElement.innerText = tipValue;
}

billInputElement.addEventListener('beforeinput', validateBillInput);
tipInputManualElement.addEventListener('beforeinput', validateNumberInput);
headCountElement.addEventListener('beforeinput', validateNumberInput);

tipInputElementsAll.forEach((element) => {
  element.addEventListener('click', (e) => {
    unselectAllTipInputs();
    e.target.dataset.selected = true;

    if (isAllDataFilled()) {
      drawOutputValues(calculateTotal(), calculateTip());
    }
  });
});

tipInputManualElement.addEventListener('blur', (e) => {
  if (!e.target.value) {
    e.target.value = 0;
    e.target.dataset.value = 0;
  }
});

tipInputManualElement.addEventListener('input', (e) => {
  e.target.dataset.value = e.target.value;
});

tipInputButtons.forEach((element) => {
  element.addEventListener('click', () => clearCustomInput());
});

[billInputElement, headCountElement].forEach((element) => {
  element.addEventListener('input', () => {
    if (!isAllDataFilled()) {
      return;
    }

    const resultTotal = calculateTotal();
    const resultTip = calculateTip();
    drawOutputValues(resultTotal, resultTip);
  });
});
