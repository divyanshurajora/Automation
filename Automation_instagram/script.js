let ppt = require("puppeteer");
let {username,password,name} = require("./idpass.json");
(async function(){
    let browser = await ppt.launch({
        headless: false,
        slowMo: 100,
        defaultViewport: null,
        args: ["--start-maximized"]

    }); 
    let pkaarray = await browser.pages();
    let page = pkaarray[0];
    await page.goto("https://www.instagram.com/accounts/login/");

    await page.waitForSelector("input[aria-label='Phone number, username, or email']",
        { visible: true });
    await page.click("input[aria-label='Phone number, username, or email']");
    await page.type("input[aria-label='Phone number, username, or email']",username);
    await page.waitForSelector("input[aria-label='Password']",
        { visible: true });
    await page.click("input[aria-label='Password']");
    await page.type("input[aria-label='Password']",password);
    await page.click("button[class='sqdOP  L3NKy   y3zKF     ']")
    
    await page.waitForSelector("button[class='aOOlW   HoLwm ']",
        { visible: true });
    //await page.click("div[role='dialog']");
    await page.click("button[class='aOOlW   HoLwm ']");

    await page.waitForSelector("input[placeholder='Search']",
    {visible: true});
    
    await page.click("input[placeholder='Search']");
    await page.type("input[placeholder='Search']",name);
    await page.waitForSelector("a[href='/aliaabhatt/']",
    {visible: true});
    await Promise.all([
        //page.click("a[href='/aliaabhatt/']"), 
        page.click(`a[href='/${name}/']`),
        page.waitForNavigation({ waitUntil: "networkidle0" })
    ]);
    //await page.click("a[href='/aliaabhatt/']");
    await handleSinglePage(page,browser);
})()

async function handleSinglePage(page,browser){
    page.goto(`https://www.instagram.com/${name}/`, { waitUntil: "networkidle0" });
    console.log(1);
    await page.waitForSelector("a[href]");
    let hrefArr = await page.$$("a[href]");
    
    let hrefPArr = [];
    for(let i=7 ; i<12; i++){
        let hrefP = page.evaluate(function (elem) {
            return elem.getAttribute("href");
        }, hrefArr[i]);
        hrefPArr.push(hrefP);
    }
    let allHref = await Promise.all(hrefPArr);
    console.log(allHref);

    let paralleltaskP = [];
    // parallely add moderator for one page
    for (let i = 0; i < allHref.length; i++) {
        let newTab = await browser.newPage();
        let p = LikeonSinglePage(newTab, `https://www.instagram.com/${allHref[i]}`);
        paralleltaskP.push(p);
    }

    await Promise.all(paralleltaskP);

}

async function LikeonSinglePage(newTab, link){
    await newTab.setDefaultNavigationTimeout(0);
    await newTab.goto(link,{waitUntil : "networkidle0"});
    
    //await newTab.waitForNavigation({waitUntil: "domcontentloaded"});

    await newTab.waitForSelector("span[class='fr66n']",{visible : true});
    await newTab.click("span[class='fr66n']");
    // await newTab.waitForSelector('button[class="wpO6b "]',{visible : true});
    // //let buttonArr = await newTab.$$('button[class="wpO6b "]');
    // let buttonArr = await newTab.$$('button[class="wpO6b "]');
    // await newTab.click(buttonArr[1]);
    //console.log(buttonArr[1]);
    
    await newTab.close();
}