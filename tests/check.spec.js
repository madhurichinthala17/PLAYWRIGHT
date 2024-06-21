const { test, expect } = require('@playwright/test');
const testCases = JSON.parse(JSON.stringify(require("../testdata.json"))); 

test.describe('Asana Data-Driven Tests', () => {
    testCases.forEach((data) => {
        test(`${data.name}`, async ({ page }) => {
            await test.step(`Login to Application - ${data.id}`, async () => {
                await page.goto("https://app.asana.com/-/login");
                const emailInput = page.locator('input[id^="lui_"]');
                await emailInput.fill("ben+pose@workwithloop.com");
                await page.click('text="Continue"');
                await page.waitForTimeout(2000);

                await emailInput.fill("Password123");
                await page.click('text="Log in"');
                await page.waitForTimeout(5000); 
            });

            await test.step(`Navigate to the project page - ${data.id}`, async () => {

                await page.waitForSelector(`text='${data.leftNav}'`, { state: 'visible' });
                await page.click(`text='${data.leftNav}'`);
                const boardBodies = await page.$$('.AsanaMain'); 
                const project = await page.$$('.AsanaMain-asanaPageAndTopbar');
                const f=await page.$$('.FullWidthPageStructureWithDetailsOverlay')
                const h=await page.$$('.FullWidthPageStructureWithDetailsOverlay-mainContent')
                await page.waitForSelector('.ProjectPage', { state: 'visible' });
                const l=await page.$$('.ProjectPage')
                const r=await page.$$('.ProjectPage-board')
                const i=await page.$$('.ProjectPage-boardInner')
                await page.waitForSelector('.Board', { state: 'visible' });
                const j=await page.$$('.Board')
             
                const k = await page.$$(`xpath=//*[contains(concat(' ', normalize-space(@class), ' '), ' BoardBody Board-body ')]`);

                const m= await page.$$('.BoardBody-columns')

                const n=await page.$$('.DragSelectContainer')
                
            });

            await test.step(`Verify the card is within the right column - ${data.id}`, async () => {
               
                const elements = await page.$$('[class$="BoardBody-columnDraggableItemWrapper SortableList-sortableItemContainer"]');
                for(const element of elements)
                    {
                            const los=await element.$$(`xpath=//*[contains(concat(' ', normalize-space(@class), ' '), ' BoardColumnHeader-leftContents BoardColumnHeader-leftContents--overflowHidden ')]`);
                           
                            for (const lo of los) {
                                
                                const h3Elements = await lo.$$(`h3`);

                                for (const h3 of h3Elements) {
                                    let text = await h3.textContent();
                                    let cleanedText=text.trim().normalize().toLowerCase().replace(/\s+/g, '');;
                                    let another=data.column.normalize().toLowerCase().replace(/\s+/g, '');;
                                    //console.log(cleanedText)
                                    //console.log(another)
                                   
                                    if (another === cleanedText)
                                        {
                                            //console.log("entered the loopy")
                                            const uff=await element.$$(`xpath=//*[contains(concat(' ', normalize-space(@class), ' '), ' SortableList BoardColumnScrollableContainer-cardsList BoardColumnWithSortableTasks-sortableList ')]`);
                                            if(uff.length >0)
                                                {
                                                for(const iu of uff)
                                                 {

                                                    const love=await iu.$$(`xpath=//*[contains(concat(' ', normalize-space(@class), ' '), ' BoardColumnWithSortableTasks-sortableItemWrapper--boardsRevamp BoardColumnWithSortableTasks-sortableItemWrapper SortableList-sortableItemContainer ')]`);
                                                    let flag=false;
                                                    for (const element of love) {
                                                    const text = await element.textContent(); 
                                                    if (text.includes(data.card_title)) {
                                                        //console.log(text)
                                                        //console.log(data.card_title)
                                                        await expect(text).toContain(data.card_title);
                                                        flag=true;
                                                        //break;
                                                    } 

                                                }
                                                if(flag==false)
                                                {
                                                   throw new Error('Test failed as there is no data with the given CardTitle') 
                                                }
                                            }
                                            }

                                           
                                        }
                                    
                                }
                            }

                            

                              

                            
                    }
            
                
            });
        });
    });
});
