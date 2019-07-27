const puppeteer = require('puppeteer')
const srcToImg = require('./helper/srcToimg')

const { mn } = require('./config/default');


(async () => {
    // 启动浏览器
    const browser = await puppeteer.launch();
    // page 实例
    const page = await browser.newPage();
    // 跳转到百度首页
    await page.goto('https://image.baidu.com');
    console.log('go to https://image.baidu.com')
    // 设置浏览器窗口大小
    await page.setViewport({
        width: 1920,
        height: 1080
    });
    console.log('reset viewport')

    // 模拟输入框输入
    //  1. 拿到输入框，并获得 focus 状态
    await page.focus('#kw')
    //  2. 模拟键盘输入
    await page.keyboard.sendCharacter('狗')
    //  3. 触发按钮的点击
    await page.evaluate(()=>document.querySelector('.s_btn').click())
    console.log('go to search list')
    // 当页面加载时，触发事件
    page.on('load', async () => {
        console.log('page loading done, start fetch');
        // 获取所有图片的 src 
        const srcs = await page.evaluate(() => {
            const images = document.querySelectorAll('img.main_img')
            return Array.prototype.map.call(images, img => img.src)
        });
        console.log(`get ${srcs.length}`);
        srcs.forEach(async (src) => {
            // sleep
            await page.waitFor(200)
            await srcToImg(src, mn)
        });
        await browser.close();
    })
})();