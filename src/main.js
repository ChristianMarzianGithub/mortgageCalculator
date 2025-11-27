import {
  MONTHS_IN_YEAR,
  DEFAULT_TERM_YEARS,
  computeMonthlyPayment,
  computePrincipalFromPayment,
  computeInterestRate,
  computeTermMonths,
  formatDuration,
} from './calculator.js';

const form = document.querySelector('#calculator-form');
const resultText = document.querySelector('#result-text');
const payoffText = document.querySelector('#payoff-text');

const inputs = {
  price: document.querySelector('#buying-price'),
  loanPercentage: document.querySelector('#loan-percentage'),
  downPayment: document.querySelector('#down-payment'),
  monthlyPayment: document.querySelector('#monthly-payment'),
};

const termInputs = {
  years: document.querySelector('#term-years'),
  months: document.querySelector('#term-months'),
};

const targetRadios = document.querySelectorAll('input[name="target-field"]');

targetRadios.forEach((radio) => {
  radio.addEventListener('change', () => setInputDisabled(getTargetField()));
});

function getTargetField() {
  const selected = [...targetRadios].find((radio) => radio.checked);
  return selected ? selected.value : 'monthlyPayment';
}

function setInputDisabled(target) {
  Object.entries(inputs).forEach(([key, element]) => {
    element.disabled = key === target;
    if (element.disabled) {
      element.placeholder = 'Will be calculated';
    } else {
      element.placeholder = '';
    }
  });
}

function readNumber(input) {
  const value = Number.parseFloat(input.value);
  return Number.isFinite(value) ? value : NaN;
}

function resolveTermYears() {
  const years = readNumber(termInputs.years);
  const months = readNumber(termInputs.months);
  const totalMonths = (Number.isFinite(years) ? Math.max(years, 0) * 12 : 0)
    + (Number.isFinite(months) ? Math.max(months, 0) : 0);

  if (totalMonths === 0) {
    return DEFAULT_TERM_YEARS;
  }

  return totalMonths / MONTHS_IN_YEAR;
}

function validateInput(target) {
  const values = Object.fromEntries(
    Object.entries(inputs).map(([key, element]) => [key, readNumber(element)]),
  );

  const missing = Object.entries(values)
    .filter(([key, value]) => (Number.isNaN(value) || value === ''))
    .map(([key]) => key);

  if (missing.length && missing.some((field) => field !== target)) {
    throw new Error('Please provide numbers for all fields except the selected calculation target.');
  }

  return values;
}

function renderResults(message, payoffMonths) {
  resultText.textContent = message;
  payoffText.textContent = payoffMonths
    ? `Estimated payoff time: ${formatDuration(payoffMonths)}.`
    : '';
}

function calculate() {
  const target = getTargetField();
  setInputDisabled(target);
  let { price, loanPercentage, downPayment, monthlyPayment } = validateInput(target);
  const termYears = resolveTermYears();

  const principal = () => price - downPayment;

  try {
    switch (target) {
      case 'monthlyPayment': {
        const loan = principal();
        if (loan <= 0) throw new Error('Down payment must be less than the buying price.');
        monthlyPayment = computeMonthlyPayment({ principal: loan, annualRate: loanPercentage, termYears });
        inputs.monthlyPayment.value = monthlyPayment.toFixed(2);
        break;
      }
      case 'price': {
        const loan = computePrincipalFromPayment({ payment: monthlyPayment, annualRate: loanPercentage, termYears });
        price = loan + downPayment;
        inputs.price.value = price.toFixed(2);
        break;
      }
      case 'loanPercentage': {
        const loan = principal();
        if (loan <= 0) throw new Error('Down payment must be less than the buying price.');
        loanPercentage = computeInterestRate({ principal: loan, payment: monthlyPayment, termYears });
        inputs.loanPercentage.value = loanPercentage.toFixed(2);
        break;
      }
      case 'downPayment': {
        const loan = computePrincipalFromPayment({ payment: monthlyPayment, annualRate: loanPercentage, termYears });
        downPayment = price - loan;
        if (downPayment < 0) throw new Error('Monthly payment is too small for the selected price and rate.');
        inputs.downPayment.value = downPayment.toFixed(2);
        break;
      }
      default:
        break;
    }

    const payoffMonths = computeTermMonths({
      principal: price - downPayment,
      annualRate: loanPercentage,
      payment: monthlyPayment,
    });

    renderResults('Calculation updated successfully.', payoffMonths);
  } catch (error) {
    renderResults(error.message, null);
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  calculate();
});

// Initialize disabled state when the page loads
setInputDisabled(getTargetField());
