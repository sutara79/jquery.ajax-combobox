/*global $*/
/** @lends external:jQuery.ajaxComboBox.prototype */
export default {
  /**
   * @private
   * @desc 選択候補を次に移す
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _nextLine: function(self) {
    var obj = self._getCurrentLine(self);
    var idx;
    if (!obj) {
      idx = -1;
    } else {
      idx = $(self.elem.results).children('li').index(obj);
      $(obj).removeClass(self.css_class.select);
    }
    idx++;
    if (idx < $(self.elem.results).children('li').length) {
      var next = $(self.elem.results).children('li').eq(idx);
      self._setSubInfo(self, next);
      $(next).addClass(self.css_class.select);
      self._setCssFocusedResults(self);
    } else {
      self._setCssFocusedInput(self);
    }
    // 選択候補を追いかけてスクロール
    self._scrollWindow(self, false);
  },

  /**
   * @private
   * @desc 選択候補を前に移す
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _prevLine: function(self) {
    var obj = self._getCurrentLine(self);
    var idx;
    if (!obj) {
      idx = $(self.elem.results).children('li').length;
    } else {
      idx = $(self.elem.results).children('li').index(obj);
      $(obj).removeClass(self.css_class.select);
    }
    idx--;
    if (idx > -1) {
      var prev = $(self.elem.results).children('li').eq(idx);
      self._setSubInfo(self, prev);
      $(prev).addClass(self.css_class.select);
      self._setCssFocusedResults(self);
    } else {
      self._setCssFocusedInput(self);
    }
    // 選択候補を追いかけてスクロール
    self._scrollWindow(self, false);
  }
};