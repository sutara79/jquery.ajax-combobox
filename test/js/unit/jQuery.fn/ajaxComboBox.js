/**
 * @file Unit Testing
 */
describe('$.fn.ajaxComboBox', () => {
  let target;

  before(() => {
    target = $('<div id="target">').appendTo('body');
  });

  after(() => {
    $('.ac_container').remove();
    target.remove();
    $(window, document, 'html').off('click');
  });

  it('should return jQuery object', () => {
    const res = target.ajaxComboBox('foo.php');
    assert.strictEqual(res, target);
  });

  it('should return this plugin\'s instance', () => {
    const res = target.ajaxComboBox('foo.php', { instance: true });
    assert.equal(res[0] instanceof $.ajaxComboBox, true);
  });
});