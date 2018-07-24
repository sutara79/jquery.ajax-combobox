/**
 * @file Preparation for unit testing
 */
const puppeteer = require('puppeteer');

module.exports = {
  /**
   * Get element from web page
   *
   * @param  {String} url      Web page running mocha in the browser
   */
  report: async function (url, waitTime) {
    let browser = await puppeteer.launch({args: ['--no-sandbox']});
    this.page = await browser.newPage();
    await this.page.goto(url, {waitUntil: 'load'});
    await this.page.waitForSelector('#done');

    let stas = await this._getStats();
    let main = await this._getReport();
    let fail = await this._checkFail();

    browser.close();
    console.log(
      '\n' +
      '# Unit testing\n\n' +
      'Goto: ' + url + '\n\n' +
      main + '\n' +
      stas
    );

    if (fail != '0') {
      throw new Error('Error: Unit testing failed.');
    }
  },

  _checkFail: function () {
    return this.page.evaluate(() => {
      return document.querySelector('#mocha-stats .failures em').textContent;
    });
  },

  /**
   * Get summary
   *
   * @return {String} Summary
   */
  _getStats: function () {
    return this.page.evaluate(() => {
      let stats = document.querySelector('#mocha-stats');
      return stats.querySelectorAll('.passes'  )[0].textContent + ', ' +
             stats.querySelectorAll('.failures')[0].textContent + ', ' +
             stats.querySelectorAll('.duration')[0].textContent;
    });
  },

  /**
   * Get main report
   *
   * @return {String} Main report
   */
  _getReport: function () {
    return this.page.evaluate(() => {
      /**
       * Look into report recursively
       *
       * @param  {Object} elem DOM
       * @param  {Number} nest  Amount of space
       * @return {String}       Message
       */
      const findReport = function (elem, nest) {
        let children = elem.children;
        let returns = '';
        for (var i = 0; i < children.length; i++) {
          // .pass か?
          if (children[i].classList.contains('pass')) {
            returns += showPass(children[i], nest);
          }

          // .fail か?
          if (children[i].classList.contains('fail')) {
            returns += showFail(children[i], nest);
          }

          // .suite か?
          if (children[i].classList.contains('suite')) {
            returns += showSuite(children[i], nest);
          }
        }
        return returns;
      };

      /**
       * Get message of suite
       *
       * @param  {String} text  Message
       * @param  {Number} nest  Amount of space
       * @return {String}       Message
       */
      const showSuite = (elem, nest) => {
        let children = elem.children;
        let returns = '';
        for (var i = 0; i < children.length; i++) {
          // 題名を表示
          if (REG.test(children[i].tagName)) {
            returns += showText(children[i].textContent, nest);
          }

          if (children[i].tagName == 'UL') {
            returns += findReport(children[i], nest + 1);
          }
        }
        return returns;
      };

      /**
       * Get message of pass
       *
       * @param  {Object} elem DOM
       * @param  {Number} nest Amount of space
       * @return {String}      Message
       */
      const showPass = function (elem, nest) {
        let children = elem.children;
        let returns = '';
        for (var i = 0; i < children.length; i++) {
          // 題名を表示
          if (REG.test(children[i].tagName)) {
            returns += showText('✓ ' + children[i].textContent, nest, 'pass');
          }
        }
        return returns;
      };

      /**
       * Get message of fail
       *
       * @param  {Object} elem DOM
       * @param  {Number} nest Amount of space
       * @return {String}      Message
       */
      const showFail = (elem, nest) => {
        let children = elem.children;
        let returns = '';
        for (var i = 0; i < children.length; i++) {
          // 題名を表示
          if (REG.test(children[i].tagName)) {
            returns += showText('✖ ' + children[i].textContent, nest, 'fail');
          }

          if (children[i].classList.contains('error')) {
            returns += showText(children[i].textContent + '\n', 0, 'log');
          }
        }
        return returns;
      };

      /**
       * Arrange a message
       *
       * @param  {String} text  Message
       * @param  {Number} nest  Amount of space
       * @param  {String} color Color for console
       * @return {String}       Message
       */
      const showText = (text, nest, color = 'default') => {
        const Color = {
          reset: "\x1b[0m",
          green: "\x1b[32m",
          red: "\x1b[31m",
          cyan: "\x1b[36m"
        };
        switch (color) {
          case 'pass':
            text = Color.green + text + Color.reset;
            break; 

          case 'fail':
            text = Color.red + text + Color.reset;
            break;

          case 'log':
            text = Color.cyan + text + Color.reset;
            break;
        }
        return '  '.repeat(nest) + text + '\n';
      };

      // Main
      let report = document.querySelector('#mocha-report');
      const REG = /H[1-6]/i;
      report.querySelectorAll('.replay, .duration').forEach(function(item) {
        item.remove();
      });
      return findReport(report, 0);
    });
  }
};