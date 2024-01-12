import puppeteer from "puppeteer"; 

describe("App.js", () => {
    //jest.setTimeout(15000) 
    let browser; 
    let page; 
     
    beforeAll(async () => { 
        browser = await puppeteer.launch(); 
        page = await browser.newPage(); 
    }); 

    test("Go to the Flash card edit page.", async () => { 
        await page.goto("http://localhost:3000/");
        await page.waitForSelector("#login-form")

        await page.click("#usernameInput")
        await page.type("#usernameInput", "Test")

        await page.click("#passwordInput")
        await page.type("#passwordInput", "Sickbro123")

        await page.click("#login-button")
        await page.waitForTimeout(1000);
        
        await page.click("#create-flash-button")
        const getResponse = await page.waitForResponse(async response => {
            return (await response.url() === 'http://localhost:4000/app/newflash' && response.status() === 200);
        });
        const responseInfo = await getResponse.json()

        // Use the id from the axios response to find the appropiate flash (card).
        await page.waitForXPath(`//*[@id="${responseInfo.id}"]`)
        const card = await page.$x(`//*[@id="${responseInfo.id}"]`)
        await card[0].waitForXPath('//*[@id="edit-flash-button"]')
        const practButt = await card[0].$x('//*[@id="edit-flash-button"]')
        
        // Test if after clicking the Edit button, the user navigates to the Flash Card Editor page.
        await practButt[0].click()
        const header = await page.$eval("#flash-title-text", (e) => e.textContent)
        expect(header).toContain("Flash Card Editor")  
    })
    afterAll(() => browser.close()); 
}); 
