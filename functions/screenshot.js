const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");

exports.handler = async (event, context) => {

    let browser = null;

    try {

        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();
        await page.goto('https://www.blupp.co');
        const screenshot = await page.screenshot({ encoding: 'base64' });

        await browser.close();
        return {

            statusCode: 200,
            body: JSON.stringify({ screenshot: screenshot }),
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
