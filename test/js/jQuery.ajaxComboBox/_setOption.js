/**
 * @file Unit Testing by QUnit 1.x -- $.ajaxComboBox._setOption()
 */
$(function() {

  module('$.ajaxComboBox._setOption', {
    setup: function() {
      $('<input id="target">').appendTo('body');
      this.target = $('#target');
    },
    teardown: function() {
      $('.ac_container').remove();
      this.target.remove();
      $(window, document, 'html').off('click');
    }
  });

  test('should be default values.', 2, function() {
    var option = $.ajaxComboBox.prototype._setOption('foo.php', {
      button_img: '../../dist/btn.png'
    });
    strictEqual(option.source, 'foo.php');
    strictEqual(option.lang, 'en');
  });

});