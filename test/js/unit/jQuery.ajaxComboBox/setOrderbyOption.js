/**
 * @file Unit Testing
 */
describe('$.ajaxComboBox._setOrderbyOption', () => {
  it('should convert strings to array', () => {
    const orders = 'field1 ASC';
    const field = 'field999';
    const result = $.ajaxComboBox.prototype._setOrderbyOption(orders, field);
    assert.equal(result[0][0], 'field1');
    assert.equal(result[0][1], 'ASC');
  });

  it('should accept multiple space', () => {
    const orders = 'field1     DESC';
    const field = 'field999';
    const result = $.ajaxComboBox.prototype._setOrderbyOption(orders, field);
    assert.equal(result[0][0], 'field1');
    assert.equal(result[0][1], 'DESC');
  });

  it('should complement a field name', () => {
    const orders = 'ASC';
    const field = 'field999';
    const result = $.ajaxComboBox.prototype._setOrderbyOption(orders, field);
    assert.equal(result[0][0], 'field999');
    assert.equal(result[0][1], 'ASC');
  });

  it('should accept lowercase "asc" or "desc"', () => {
    // In the future, lowercase "asc" or "desc" are judged to be field names.

    const orders = 'desc';
    const field = 'field999';
    const result = $.ajaxComboBox.prototype._setOrderbyOption(orders, field);
    assert.equal(result[0][0], 'field999');
    assert.equal(result[0][1], 'desc');
  });

  it('should accept an array', () => {
    const orders = [
      'field1',
      'field2 DESC',
      'field3     ASC',
      'DESC'
    ];
    const field = 'field999';
    const result = $.ajaxComboBox.prototype._setOrderbyOption(orders, field);
    assert.equal(result[0][0], 'field1');
    assert.equal(result[0][1], 'ASC');

    assert.equal(result[1][0], 'field2');
    assert.equal(result[1][1], 'DESC');

    assert.equal(result[2][0], 'field3');
    assert.equal(result[2][1], 'ASC');

    assert.equal(result[3][0], 'field999');
    assert.equal(result[3][1], 'DESC');
  });
});