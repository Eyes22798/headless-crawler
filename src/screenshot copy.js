const puppeteer = require('puppeteer')
const { screenshot } = require('./config/default');


(async () => {
    // 启动浏览器
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://baidu.com');
    // 把图片放在哪里，并命名
    await page.screenshot({
        path: `${screenshot}/${Date.now()}.png`
    });
    await browser.close();
})();