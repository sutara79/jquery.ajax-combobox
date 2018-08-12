const path = require('path');
const webpack = require('webpack');
const pjson = require('./package.json');

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    filename: pjson.name + '.min.js',
    path: path.join(__dirname, 'dist/js')
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `${pjson.name} v${pjson.version} | ${pjson.author} | license: ${pjson.license}`
    })
  ]
};