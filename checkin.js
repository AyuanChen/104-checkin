const puppeteer = require('puppeteer');
const config = require('./config/default.json');
const time = require('./modules/time.js');

(async () => {
    await time.sleep(time.random_secs(config.random_sec));
    const browser = await puppeteer.launch({
          headless: false,
          //set false to enable brwoser, otherwise it will run in background
          defaultViewport: null,
          executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          userDataDir: './User_Data'
    })
    
    const page = await browser.newPage();
    await page.goto(config.urls.login);

    try
    {
        console.log('Login page');
        //await page.waitForSelector('#app');
        await page.waitForSelector('button[data-qa-id="loginButton"]', {timeout: config.timeout_ms});
        await page.type('input[data-qa-id="loginUserName"]', config.user.username, {
            delay: 100
        })
        await page.type('input[data-qa-id="loginPassword"]', config.user.password, {
            delay: 100
        })
        await page.click('button[data-qa-id="loginButton"]')
    }
    catch(error)
    {
        console.log('Already login?');
    }

    await page.goto(config.urls.checkin);
    await page.waitForSelector('#PSC2', {timeout: config.timeout_ms});
    //wait for elements to appear on the page 
    await page.waitForSelector('.col-xs-12' , {timeout: config.timeout_ms});
    // capture all the items
    let elements = await page.$$('.col-xs-12');
    // loop trough items
    for (let i = 0; i < elements.length; i++) 
    {
        let text = await page.evaluate(el => el.innerText, elements[i]);
        if(text.indexOf("打卡") > -1 )
        {
            console.log("我要打卡囉")
            await elements[i].click();
            break;
        }
    }

    await page.screenshot({path: './records/'+time.current_time()+'checkin.png'});  
    await browser.close();
    
})();