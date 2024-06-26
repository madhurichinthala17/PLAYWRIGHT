const { test, expect } = require('@playwright/test');
const testCases = require("../testdata.json"); // Directly require the JSON file without redundant parsing

test.describe('Asana Data-Driven Tests', () => {
    testCases.forEach((data) => {
        test(data.name, async ({ page }) => {
            await test.step(`Login to Application - ${data.id}`, async () => {
                await page.goto("https://app.asana.com/-/login");
                const emailInput = page.locator('input[id^="lui_"]');
                await emailInput.fill("ben+pose@workwithloop.com");
                await page.click('text="Continue"');
                await page.waitForSelector('input[type="password"]', { state: 'visible' });

                await emailInput.fill("Password123");
                await page.click('text="Log in"');
                // Assume logged in directly navigates to the project page
            });

            await test.step(`Navigate to the project page - ${data.id}`, async () => {
                await page.click(`text='${data.leftNav}'`);
                await page.waitForSelector('.ProjectPage', { state: 'visible' }); 
                await page.waitForSelector('.Board', { state: 'visible' });
            });

            await test.step(`Verify the card is within the right column - ${data.id}`, async () => {
                const columns = await page.$$('[data-test-id="board-column"]');
                let isCardFound = false;

                for (const column of columns) {
                    const columnHeader = await column.$('.BoardColumnHeader-leftContents');
                    const headerText = await columnHeader.textContent();
                    if (headerText.trim().toLowerCase() === data.column.trim().toLowerCase()) {
                        const cards = await column.$$('.BoardColumn-card');
                        for (const card of cards) {
                            const cardTitle = await card.textContent();
                            if (cardTitle.includes(data.card_title)) {
                                await expect(cardTitle).toContain(data.card_title);
                                isCardFound = true;
                                break;
                            }
                        }
                    }
                    if (isCardFound) break;
                }

                if (!isCardFound) {
                    throw new Error(`Card titled '${data.card_title}' not found in the specified column`);
                }
            });
        });
    });
});
