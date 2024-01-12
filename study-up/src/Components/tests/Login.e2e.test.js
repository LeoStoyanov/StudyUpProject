import puppeteer from "puppeteer"; 

describe("App.js", () => { 
    let browser; 
    let page; 
     
    beforeAll(async () => { 
        browser = await puppeteer.launch(); 
        page = await browser.newPage(); 
    }); 

    test("Go to dashboard after successful login.", async () => { 
        await page.goto("http://localhost:3000/");
        await page.waitForSelector("#login-form")

        await page.click("#usernameInput")
        await page.type("#usernameInput", "JamesRocks")

        await page.click("#passwordInput")
        await page.type("#passwordInput", "Okok1234@")

        await page.click("#login-button")
        await page.waitForTimeout(1000);

        const header = await page.$eval("#dashboard-header", (e) => e.textContent)
        expect(header).toContain("JamesRocks's Dashboard")
        
    })
    afterAll(() => browser.close()); 
}); 