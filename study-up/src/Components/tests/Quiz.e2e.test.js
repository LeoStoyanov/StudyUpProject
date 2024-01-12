import puppeteer from "puppeteer"; 

describe("App.js", () => {
    //jest.setTimeout(15000) 
    let browser; 
    let page; 
     
    beforeAll(async () => { 
        browser = await puppeteer.launch(); 
        page = await browser.newPage(); 
    }); 

    test("Go to a quiz completion page.", async () => { 
        await page.goto("http://localhost:3000/");
        await page.waitForSelector("#login-form")

        await page.click("#usernameInput")
        await page.type("#usernameInput", "JamesRocks")

        await page.click("#passwordInput")
        await page.type("#passwordInput", "Okok1234@")

        await page.click("#login-button")
        await page.waitForTimeout(1000);

        // Use default History Quiz for the test.
        await page.waitForXPath('//*[@id="1iRkqgQ5e"]')
        const card = await page.$x('//*[@id="1iRkqgQ5e"]')
        await card[0].waitForXPath('//*[@id="pract-quiz-button"]')
        const compButt = await card[0].$x('//*[@id="pract-quiz-button"]')

        // Test if after clicking the Complete Quiz button, the user navigates to the respective quiz's page to complete it.
        await compButt[0].click()
        const getResponse = await page.waitForResponse(async response => {
            return (await response.url() === 'http://localhost:4000/app/getquiz' && response.status() === 200);
        });
        const responseInfo = await getResponse.json()
        
        // Had to use X path to find the Quiz header (compared to other e2e tests) due to an error.
        await page.waitForXPath('//*[@id="root"]/div/div/div[2]/div[1]/div/label/h3')
        const header = await page.$x('//*[@id="root"]/div/div/div[2]/div[1]/div/label/h3')
        const check = await page.evaluate((e) => e.textContent, header[0])
        expect(check).toContain(`${responseInfo.quizInfo.quizTitle}`)

    })
    afterAll(() => browser.close()); 
}); 