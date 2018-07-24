/**
 * @file HTTP server
 */
const connect = require('connect');
const serveStatic = require('serve-static');

module.exports = {
  /**
   * [description]
   *
   * @param  {Number} port Port number
   * @param  {String} root DocumentRoot
   */
  start: function (port = 8080, root = './') {
    const server = connect();
    server.use(serveStatic(root));
    console.log('Server running on ' + port);
    return new Promise((resolve, reject) => {
      server.listen(port, () => {
        return resolve(server)
      });
    });
  }
};