const MONTHS_IN_YEAR = 12;
const DEFAULT_TERM_YEARS = 30;

function monthlyRate(annualRate) {
  if (Number.isNaN(annualRate) || annualRate < 0) {
    throw new Error('Annual rate must be zero or positive');
  }
  return annualRate / 100 / MONTHS_IN_YEAR;
}

function computeMonthlyPayment({ principal, annualRate, termYears = DEFAULT_TERM_YEARS }) {
  if (principal <= 0 || termYears <= 0) {
    throw new Error('Principal and term must be positive');
  }
  const r = monthlyRate(annualRate);
  const n = termYears * MONTHS_IN_YEAR;
  if (r === 0) {
    return principal / n;
  }
  const factor = Math.pow(1 + r, n);
  return (principal * r * factor) / (factor - 1);
}

function computePrincipalFromPayment({ payment, annualRate, termYears = DEFAULT_TERM_YEARS }) {
  if (payment <= 0 || termYears <= 0) {
    throw new Error('Payment and term must be positive');
  }
  const r = monthlyRate(annualRate);
  const n = termYears * MONTHS_IN_YEAR;
  if (r === 0) {
    return payment * n;
  }
  const factor = Math.pow(1 + r, n);
  return payment * ((factor - 1) / (r * factor));
}

function computeInterestRate({ principal, payment, termYears = DEFAULT_TERM_YEARS }) {
  if (principal <= 0 || payment <= 0 || termYears <= 0) {
    throw new Error('Principal, payment, and term must be positive');
  }
  const n = termYears * MONTHS_IN_YEAR;
  const maxIterations = 50;
  let low = 0;
  let high = 100;

  const paymentForRate = (rate) => computeMonthlyPayment({ principal, annualRate: rate, termYears });

  for (let i = 0; i < maxIterations; i += 1) {
    const mid = (low + high) / 2;
    const guess = paymentForRate(mid);
    if (Math.abs(guess - payment) < 0.01) {
      return mid;
    }
    if (guess > payment) {
      high = mid;
    } else {
      low = mid;
    }
  }
  return (low + high) / 2;
}

function computeTermMonths({ principal, annualRate, payment }) {
  if (principal <= 0 || payment <= 0) {
    throw new Error('Principal and payment must be positive');
  }
  const r = monthlyRate(annualRate);
  if (r === 0) {
    return Math.ceil(principal / payment);
  }
  const numerator = Math.log(payment) - Math.log(payment - r * principal);
  const denominator = Math.log(1 + r);
  if (!Number.isFinite(numerator) || numerator <= 0) {
    throw new Error('Payment is too small to cover interest');
  }
  return Math.ceil(numerator / denominator);
}

function formatDuration(months) {
  const years = Math.floor(months / MONTHS_IN_YEAR);
  const remainingMonths = months % MONTHS_IN_YEAR;
  return `${years} year${years === 1 ? '' : 's'} ${remainingMonths} month${remainingMonths === 1 ? '' : 's'}`;
}

export {
  MONTHS_IN_YEAR,
  DEFAULT_TERM_YEARS,
  monthlyRate,
  computeMonthlyPayment,
  computePrincipalFromPayment,
  computeInterestRate,
  computeTermMonths,
  formatDuration,
};
