/*global $*/
/** @lends external:jQuery.ajaxComboBox.prototype */
export default {
  /**
   * @private
   * @desc 独自のソート (昇順)
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   * @param {Array} arr - 検索結果の配列
   */
  _sortAsc: function(self, arr) {
    arr.sort(function(a, b) {
      return a[self.option.order_by[0][0]].localeCompare(b[self.option.order_by[0][0]]);
    });
    return arr;
  },

  /**
   * @private
   * @desc 独自のソート (降順)
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   * @param {Array} arr - 検索結果の配列
   */
  _sortDesc: function(self, arr) {
    arr.sort(function(a, b) {
      return b[self.option.order_by[0][0]].localeCompare(a[self.option.order_by[0][0]]);
    });
    return arr;
  },

  /**
   * @private
   * @desc 問い合わせ該当件数ゼロだった場合の処理
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _notFoundSearch: function(self) {
    $(self.elem.navi_info).text(self.message.not_found);
    $(self.elem.navi_p).hide();
    $(self.elem.results).empty();
    $(self.elem.sub_info).empty();
    self._calcWidthResults(self);
    $(self.elem.container).addClass(self.css_class.container_open);
    self._setCssFocusedInput(self);
  }
};