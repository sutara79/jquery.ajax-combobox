/**
 * @file E2E testing
 */
const puppeteer = require('puppeteer');
const assert = require('assert');

let path = 'sample/select-only-basic';
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

  describe('ac_button', () => {
    before(async () => {
      await page.click('.ac_button');
      await page.waitFor(200);
    });

    it('should show all items', async () => {
      const isVisible = await page.evaluate(() => {
        const e = document.querySelector('.ac_results');
        const style = window.getComputedStyle(e);
        return style.display !== 'none';
      });
      assert.equal(isVisible, true);
    });

    it('should show sub-info', async () => {
      const isVisible = await page.evaluate(() => {
        const e = document.querySelector('.ac_subinfo dl');
        const style = window.getComputedStyle(e);
        return style.display !== 'none';
      });
      assert.equal(isVisible, true);
    });
  });

  describe('Typing in text-box', () => {
    before(async () => {
      await page.type('.ac_input', 'ad');
      await page.waitFor(500);
    });

    it('should show 4 items', async () => {
      let elem = await page.$$('.ac_results li');
      assert.equal(elem.length, 4);
    });

    it('should warn to choose from list', async () => {
      let elem = await page.$$('.ac_input.ac_select_ng');
      assert.equal(elem.length, 1);
    });
  });
});
