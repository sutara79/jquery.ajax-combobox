/*global $*/
/** @lends external:jQuery.ajaxComboBox.prototype */
export default {
  /**
   * @private
   * @desc キー入力への対応
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   * @param {Object} e - jQueryのイベントオブジェクト
   */
  _processKey: function(self, e) {
    if (
      ($.inArray(e.keyCode, [27,38,40,9]) > -1 && $(self.elem.result_area).is(':visible')) ||
      ($.inArray(e.keyCode, [37,39,13,9]) > -1 && self._getCurrentLine(self)) ||
      (e.keyCode == 40 && self.option.plugin_type != 'textarea')
    ) {
      e.preventDefault();
      e.stopPropagation();
      e.cancelBubble = true;
      e.returnValue  = false;

      switch (e.keyCode) {
        case 37: // left
          if (e.shiftKey) self._firstPage(self);
          else            self._prevPage(self);
          break;

        case 38: // up
          self.prop.key_select = true;
          self._prevLine(self);
          break;

        case 39: // right
          if (e.shiftKey) self._lastPage(self);
          else            self._nextPage(self);
          break;

        case 40: // down
          if ($(self.elem.results).children('li').length) {
            self.prop.key_select = true;
            self._nextLine(self);
          } else {
            self.prop.is_suggest = false;
            self._suggest(self);
          }
          break;

        case 9: // tab
          self.prop.key_paging = true;
          self._hideResults(self);
          break;

        case 13: // return
          self._selectCurrentLine(self, true);
          break;

        case 27: //  escape
          self.prop.key_paging = true;
          self._hideResults(self);
          break;
      }
    } else {
      if (e.keyCode != 16) self._setCssFocusedInput(self); // except Shift(16)
      self._checkValue(self);
    }
  },

  /**
   * @private
   * @desc Ajax通信を中断する
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _abortAjax: function(self) {
    if (self.prop.xhr) {
      self.prop.xhr.abort();
      self.prop.xhr = false;
    }
  }
};