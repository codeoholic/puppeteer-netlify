const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");

chromium.setHeadlessMode = true;

// Optional: If you'd like to disable webgl, true is the default.
chromium.setGraphicsMode = false;

exports.handler = async (event, context) => {

    const params = new URLSearchParams(event.queryStringParameters);
    // Accessing parameters
    const url = params.get('url');

    let browser = null;

    try {

        browser = await puppeteer.launch({
            args: [
                ...chromium.args,
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote',
                '--deterministic-fetch',
                '--disable-features=IsolateOrigins',
                '--disable-site-isolation-trials',
            ],
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });

        const page = await browser.newPage();
        // await page.setRequestInterception(true)
        await page.goto(url, {

            waitUntil: ['networkidle0', 'load', 'domcontentloaded'],
            timeout: 30000 // 30 seconds

        });

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
