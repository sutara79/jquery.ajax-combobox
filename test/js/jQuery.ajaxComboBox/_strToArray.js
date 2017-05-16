/**
 * @file Unit Testing by QUnit 1.x -- $.ajaxComboBox._strToArray()
 */
$(function() {

  module('$.ajaxComboBox._strToArray');

  test('should be trimmed and splitted by comma.', 3, function() {
    var str = ' aaa　,  bbb,　　ccc';
    var arr = $.ajaxComboBox.prototype._strToArray(str);
    strictEqual(arr[0], 'aaa');
    strictEqual(arr[1], 'bbb');
    strictEqual(arr[2], 'ccc');
  });

});