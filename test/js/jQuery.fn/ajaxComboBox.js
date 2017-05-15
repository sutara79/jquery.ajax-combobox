/**
 * @file Unit Testing by QUnit 1.x -- $.fn.ajaxComboBox()
 */
$(function() {

  module('$.fn.ajaxComboBox', {
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

  test('should return jQuery object', 1, function() {
    var returns = this.target.ajaxComboBox('foo.php', {
      button_img: '../../dist/btn.png'
    });
    strictEqual(returns, this.target);
  });

  test('should return this plugin\'s instance', 1, function() {
    var returns = this.target.ajaxComboBox('foo.php', {
      button_img: '../../dist/btn.png',
      instance: true
    });
    ok(returns[0] instanceof $.ajaxComboBox === true);
  });

});