const chromium = require("@sparticuz/chromium-min");
const puppeteer = require("puppeteer-core");

exports.handler = async (event, context) => {

    let browser = null;
    chromium.setHeadlessMode = true;
    // Optional: If you'd like to disable webgl, true is the default.
    chromium.setGraphicsMode = false;

    try {

        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath("/opt/chromium"),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();
        await page.setRequestInterception(true)
        await page.goto('https://www.blupp.co', {

            waitUntil: ['networkidle0', 'load', 'domcontentloaded'],
            timeout: 30000 // 30 seconds

        });
        await page.waitForTimeout(2000);
        // const screenshot = await page.screenshot({
        //     encoding: 'base64',
        //     fullPage: true
        // });

        const pageTitle = await page.title();
        await browser.close();
        return {

            statusCode: 200,
            body: JSON.stringify({ title: pageTitle }),
            headers: {
                'Content-Type': 'application/json',
            },

        };

    } catch (error) {

        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.toString() }),
            headers: {
                'Content-Type': 'application/json',
            },
        };

    } finally {

        if (browser) {

            await browser.close();

        }

    }

}
