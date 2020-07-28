let ppt = require("puppeteer");
let { email, password } = require("../../credentials.json");
(async function(){
    let browser = await ppt.launch({
        headless: false,
        slowMo: 100,
        defaultViewport: null,
        args: ["--start-maximized"]

    }); 
    let pkaarray = await browser.pages();
    let page = pkaarray[0];
    await page.goto("https://www.hackerrank.com/auth/login?h_l=body_middle_left_button&h_r=login");

    await page.type("#input-1",email);
    await page.type("#input-2",password);
    //await page.click("button[data-analytics='LoginPassword']");
    await Promise.all([
        page.waitForNavigation({waituntil: "networkidle0"}),
        page.click("button[data-analytics='LoginPassword']")
    ]);
    await page.waitForSelector("a[data-analytics='NavBarProfileDropDown']",
        { visible: true });
    await page.click("a[data-analytics='NavBarProfileDropDown']");

    await page.waitForSelector("a[data-analytics='NavBarProfileDropDownAdministration']",
        { visible: true });
    await Promise.all([
        page.click("a[data-analytics='NavBarProfileDropDownAdministration']"), 
        page.waitForNavigation({ waitUntil: "networkidle0" })
    ]);
    await page.goto("https://www.hackerrank.com/administration/challenges", { waitUntil: "networkidle0" });
    await handleSinglePage(page, browser);

})()

async function handleSinglePage(page, browser) {
    await page.waitForSelector("a.backbone.block-center");
    // findelement=> $
    // findelements=> $$
    let allchallenges = await page.$$("a.backbone.block-center");
    let hrefPArr = [];

    for (let i = 0; i < allchallenges.length; i++) {
        // selenium
        // allchallenges[i].getAttribute("href");

        // puppeteer
        let hrefP = page.evaluate(function (elem) {
            return elem.getAttribute("href");
        }, allchallenges[i]);
        hrefPArr.push(hrefP);
    }
    let allHref = await Promise.all(hrefPArr);
    console.log(allHref);
    let paralleltaskP = [];
    // parallely add moderator for one page
    for (let i = 0; i < allHref.length; i++) {
        let newTab = await browser.newPage();
        let p = solveSingleQs(newTab, `https://www.hackerrank.com${allHref[i]}`);
        paralleltaskP.push(p);
    }

    await Promise.all(paralleltaskP);

    // next page is available=> repeat
    let liList = await page.$$(".pagination ul li");
    let next = await page.evaluate(function (elem){
        return elem.getAttribute("class");
    },liList[5]);
    if(next != "disabled"){
        await Promise.all([
            page.waitForNavigation({waitUntil : "networkidle0"}),
            page.click("a[data-attr1='Right']")
        ]);
        await handleSinglePage(page,browser);
    }
    // return 
}
// async function solveSingleQs(newTab, link) {
//     await newTab.goto(link, { waitUntil: "networkidle0" });
//     
//     
//     await newTab.waitForSelector("li[data-tab='moderators']");
//     
//     await Promise.all([
//         newTab.click("li[data-tab='moderators']"), 
//         newTab.waitForNavigation({ waitUntil: "networkidle0" })
//     ]);
//     await newTab.waitForSelector("#moderator",
//         { visible: true });
//     await newTab.type("#moderator","div");
//     await newTab.keyboard.press('Enter');
//     await newTab.click(".save-challenge.btn.btn-green");
//     await newTab.close();

//     // add a user as a moderator
//     // close 
// }

async function solveSingleQs(newTab,link){
    await newTab.goto(link,{waitUntil : "networkidle0"});
    await newTab.waitForSelector("li[data-tab='moderators'] a",{visible : true});
    await newTab.click("li[data-tab='moderators'] a");
    await newTab.waitForSelector("#moderator");
    await newTab.type("#moderator","sachin");
    await newTab.keyboard.press('Enter');
    await newTab.click(".save-challenge.btn.btn-green");
    await newTab.close();
}