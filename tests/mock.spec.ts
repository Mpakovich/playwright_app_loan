import { test, expect } from '@playwright/test';
import { SmallLoanPage } from '../page-objects/pages/SmallLoanPage';

test.describe('Loan app mock tests', async () => {
  test('TL-21-1 positive test', async ({ page }) => {
    const expectedMonthlyAmount = 100005;
    const smallLoanPage = new SmallLoanPage(page);

    await page.route('**/api/loan-calc*', async (request) => {
      const responseBody = { paymentAmountMonthly: expectedMonthlyAmount };
      await request.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(responseBody),
      });
    });

    const loanCalcResponse = page.waitForResponse('**/api/loan-calc*');
    await smallLoanPage.open();
    await loanCalcResponse;
    await smallLoanPage.checkMonthlyAmount(expectedMonthlyAmount);
  });

  test('HW-17-1 server error 500 with no response body', async ({ page }) => {
    const smallLoanPage = new SmallLoanPage(page);

    await page.route('**/api/loan-calc*', async (request) => {
      await request.fulfill({
        status: 500,
        contentType: 'application/json',
      });
    });

    const loanCalcResponse = page.waitForResponse('**/api/loan-calc*');
    await smallLoanPage.open();
    await loanCalcResponse;
    await smallLoanPage.checkErrorDisplayed();
  });

  test('HW-17-2 200 OK but no response body', async ({ page }) => {
    const smallLoanPage = new SmallLoanPage(page);

    await page.route('**/api/loan-calc*', async (request) => {
      await request.fulfill({
        status: 200,
        contentType: 'application/json',
      });
    });

    const loanCalcResponse = page.waitForResponse('**/api/loan-calc*');
    await smallLoanPage.open();
    await loanCalcResponse;
    await smallLoanPage.checkErrorDisplayed()
  });

  test('HW-17-3 200 OK but incorrect key in response', async ({ page }) => {
    const smallLoanPage = new SmallLoanPage(page);

    await page.route('**/api/loan-calc*', async (request) => {
      const responseBody = { wrongKey: 100005 };
      await request.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(responseBody),
      });
    });

    const loanCalcResponse = page.waitForResponse('**/api/loan-calc*');
    await smallLoanPage.open();
    await loanCalcResponse;
    await smallLoanPage.checkErrorMessageDisplayed;
  });
});
