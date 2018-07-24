/**
 * @file Preparation for E2E testing
 */
const Mocha = require('mocha');
const fs = require('fs');
const path = require('path');

module.exports = {
  /**
   * Run E2E testing
   *
   * @param {String} testDir - Directory that contains mocha files
   * @return {Object} Failures of testing
   */
  report: function (testDir) {
    console.log('\n# E2E testing');

    const mocha = new Mocha({
      timeout: 5000,
      ui: 'bdd',
      reporter: 'spec'
    });

    // Mocha: addFile
    fs.readdirSync(testDir).filter(function (file) {
       return file.substr(-3) === '.js';
    }).forEach(function (file) {
      mocha.addFile(
        path.join(testDir, file)
      );
    });

    return new Promise((resolve, reject) => {
      mocha.run(failures => {
        resolve(failures);
      });
    });
  }
};
