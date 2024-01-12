import puppeteer from "puppeteer"; 





describe("App.js", () => {
    jest.setTimeout(15000) 
    let browser; 
    let page; 
     
    beforeAll(async () => { 
        browser = await puppeteer.launch(); 
        page = await browser.newPage(); 
    }); 

    test("Go to a note page.", async () => { 
        await page.goto("http://localhost:3000/");
        await page.waitForSelector("#login-form")

        await page.click("#usernameInput")
        await page.type("#usernameInput", "Test")

        await page.click("#passwordInput")
        await page.type("#passwordInput", "Sickbro123")

        await page.click("#login-button")
        await page.waitForTimeout(1000);
        // Logged in and hit the button
        await page.click("#create-note-button")
        const getResponse = await page.waitForResponse(async response => {
            return (await response.url() === 'http://localhost:4000/app/newNote' && response.status() === 200);
        });
        const responseInfo = await getResponse.json()

        // going into the new note
        await page.waitForXPath(`//*[@id="${responseInfo.id}"]`)
        const card = await page.$x(`//*[@id="${responseInfo.id}"]`)
        await card[0].waitForXPath('//*[@id="veiw-note-button"]')
        const noteButton = await card[0].$x('//*[@id="veiw-note-button"]')
        await noteButton[0].click()        
        
        //checking title value
        const check = await page.$eval("#note-title-text",(e) => e.textContent)
        expect(check).toContain(`${responseInfo.title}`)
    })

    afterAll(() => browser.close()); 
}); 