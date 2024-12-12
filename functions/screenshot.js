const chromium = require("chrome-aws-lambda")

exports.handler = async (event, context) => {

  try {

    const browser = await chromium.puppeteer.launch({

        executablePath: await chromium.executablePath,
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
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
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.toString() }),
    };
  }
};
