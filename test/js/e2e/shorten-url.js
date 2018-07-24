/**
 * @file E2E testing
 */
const puppeteer = require('puppeteer');
const assert = require('assert');

let path = 'sample/shorten-url';
describe(path, () => {
  const appUrl = `http://localhost:${process.env.MY_PORT}/${path}`;
  let browser, page;

  before(async () => {
    browser = await puppeteer.launch({args: ['--no-sandbox']});
    // browser = await puppeteer.launch({headless: false, slowMo: 250});
    page = await browser.newPage();
    page.on('console', console.log);
    await page.goto(appUrl, {waitUntil: 'load'});
  });

  after(async () => {
    browser.close();
  });

  describe('Shorten URL', () => {
    before(async () => {
      await page.waitFor(500);
      await page.click('#foo-shorten');
      await page.waitFor(2000);
    });

    it('should return shorten texts', async () => {
      const res = await page.evaluate(() => {
        return document.querySelector('.ac_textarea').value;
      });
      assert.equal(res, `http://bit.ly/2r1uU0F *good*
(http://bit.ly/2r1uU0F) *good*
ftp://too.short *bad* (Set "shorten_min" option)
Do not touch URLhttps://en.wikipedia.org/wiki/JQuery *bad*
en.wikipedia.org/wiki/JQuery *bad* (URI scheme is required)
`);
    });
  });
});
