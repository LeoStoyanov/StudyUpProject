import puppeteer from "puppeteer"; 

describe("App.js", () => {
    jest.setTimeout(15000) 
    let browser; 
    let page; 
     
    beforeAll(async () => { 
        browser = await puppeteer.launch(); 
        page = await browser.newPage(); 
    }); 

    test("Go to a flash page.", async () => { 
        await page.goto("http://localhost:3000/");
        await page.waitForSelector("#login-form")

        await page.click("#usernameInput")
        await page.type("#usernameInput", "Test")

        await page.click("#passwordInput")
        await page.type("#passwordInput", "Sickbro123")

        await page.click("#login-button")
        await page.waitForTimeout(1000);

        await page.waitForXPath('//*[@id="KBt4xEdlh"]')
        const card = await page.$x('//*[@id="KBt4xEdlh"]')
        await card[0].waitForXPath('//*[@id="view-flash-button"]')
        const compButt = await card[0].$x('//*[@id="view-flash-button"]')

        // Test if after clicking the Complete Quiz button, the user navigates to the respective quiz's page to complete it.
        await compButt[0].click()
        const getResponse = await page.waitForResponse(async response => {
            return (await response.url() === 'http://localhost:4000/app/getflash' && response.status() === 200);
        });
        const responseInfo = await getResponse.json()
        
        //checking title value
        const check = await page.$eval("#flash-title-text",(e) => e.textContent)
        expect(check).toContain(`${"Untitled"}`)




        






    })
    afterAll(() => browser.close()); 
}); 