/**
 * @file Unit Testing by QUnit 1.x -- $.ajaxComboBox._setOption()
 */
$(function() {

  module('$.ajaxComboBox._setOption');

  test('should be default values.', 5, function() {
    var option = $.ajaxComboBox.prototype._setOption('foo.php');
    equal(option.source, 'foo.php');
    equal(option.lang, 'en');
    deepEqual(option.show_field, ['*']);
    deepEqual(option.hide_field, ['']);
    deepEqual(option.search_field, ['name']);
  });

  test('should be modified values.', 1, function() {
    var option = $.ajaxComboBox.prototype._setOption('foo.php', {
      search_field: 'id, name'
    });

    deepEqual(option.search_field, ['id', 'name']);
  });
});