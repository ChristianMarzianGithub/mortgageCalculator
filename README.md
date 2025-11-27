# Mortgage Calculator

A single-page tool that estimates how long it will take to pay off a mortgage. Enter the property price, interest rate,
down payment, monthly payment, and loan term, then choose which value to calculate.

## Features

- Calculate one missing field (buying price, interest rate, down payment, or monthly payment) using a radio selector.
- Estimate payoff duration based on the provided or calculated monthly payment.
- Default 30-year amortization assumption for calculated figures.
- Optional loan term input in years and months to override the default amortization period.
- Placeholder Google AdSense areas on the left and right columns.

## Getting started

1. Open `index.html` in your browser to use the calculator.
2. Fill in three fields and select the fourth to calculate. Optionally enter a custom loan term in years and months;
   leaving it blank uses a 30-year term.
3. Click **Calculate** to see the computed value and payoff estimate.
4. Replace the placeholder `data-ad-client` and `data-ad-slot` attributes with your own AdSense IDs when deploying.

## Development

- Calculator logic lives in `src/calculator.js` and is wired to the UI through `src/main.js` with styles in
  `src/styles.css`.
- Tests rely on the Node.js built-in test runner.

### Run tests

```bash
npm test
```
