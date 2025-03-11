import { test, expect } from '@playwright/test';
import {SmallLoanPage} from "../page-objects/pages/SmallLoanPage";
import {LoanDecisionPage} from "../page-objects/pages/LoanDecisionPage";

test.describe("Loan app tests", async  () => {
  test ('TL-20-1 base test', async ({ page } ) => {
    const smallloanPage = new SmallLoanPage(page)
    const loadDecisionPage = new LoanDecisionPage(page)
    await smallloanPage.open()
    const prefilledAmount = await smallloanPage.amountInput.getCurrentValue()
    const predilledPeriod = await smallloanPage.getFirstPeriodOption()
    await smallloanPage.applyButton.click()
    await smallloanPage.usernameInput.fill("test")
    await smallloanPage.passwordInput.fill("test")
    await smallloanPage.continueButton.click()
    const finalAmount = await loadDecisionPage.getFinalAmountValue()
    const finalPeriod = await loadDecisionPage.getFinalPeriodValue()

    expect(finalAmount).toEqual(prefilledAmount)
    expect(finalPeriod).toEqual(predilledPeriod)
  })
})
