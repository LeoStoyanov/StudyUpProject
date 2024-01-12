import puppeteer from "puppeteer"; 

describe("App.js", () => { 
    let browser; 
    let page; 
     
    beforeAll(async () => { 
        browser = await puppeteer.launch(); 
        page = await browser.newPage(); 
    }); 

    test("Go to login page after successful account creation.", async () => { 
        await page.goto("http://localhost:3000/createaccount");
        await page.waitForSelector("#create-acc-form")

        await page.click("#emailInput")
        await page.type("#emailInput", "adrian@gmail.com")

        await page.click("#usernameInput")
        await page.type("#usernameInput", "Adrian")

        await page.click("#passwordInput")
        await page.type("#passwordInput", "Okok1234@")
        await page.click("#create-acc-button")

        await page.click("#create-acc-button")
        await page.waitForSelector("#login-header");

        const header = await page.$eval("#login-header", (e) => e.textContent)
        expect(header).toContain("Login")
        
    })
    afterAll(() => browser.close()); 
}); 
 