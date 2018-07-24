/**
 * @file Unit Testing
 */
describe('$.ajaxComboBox._setOption', () => {
  it('should be default values.', () => {
    const option = $.ajaxComboBox.prototype._setOption('foo.php');
    assert.equal(option.source, 'foo.php');
    assert.equal(option.lang, 'en');
    assert.deepEqual(option.show_field, ['*']);
    assert.deepEqual(option.hide_field, ['']);
    assert.deepEqual(option.search_field, ['name']);
  });

  it('should be modified values.', () => {
    const option = $.ajaxComboBox.prototype._setOption('foo.php', {
      search_field: 'id, name'
    });
    assert.deepEqual(option.search_field, ['id', 'name']);
  });
});