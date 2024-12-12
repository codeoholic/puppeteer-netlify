const chromium = require('chrome-aws-lambda');

const main = async (event) => {
    console.log("calling this");
  let result = null;
  let browser = null;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    console.log("browser launched");

    const page = await browser.newPage();
    await page.goto(event.url || 'https://blupp.co');

    result = await page.title();
    console.log(result);

    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};

main({ url: 'https://blupp.co' });
