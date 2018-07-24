/**
 * @file Unit Testing
 */
describe('$.ajaxComboBox._strToArray', () => {
  it('should be trimmed and splitted by comma.', () => {
    const str = ' aaa　,  bbb,　　ccc';
    const arr = $.ajaxComboBox.prototype._strToArray(str);
    assert.equal(arr[0], 'aaa');
    assert.equal(arr[1], 'bbb');
    assert.equal(arr[2], 'ccc');
  });
});
