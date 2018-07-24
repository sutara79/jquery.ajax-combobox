/*global $*/
/** @lends external:jQuery.ajaxComboBox.prototype */
export default {
  /**
   * @private
   * @desc 1ページ目を表示する
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _firstPage: function(self) {
    if (!self.prop.is_suggest) {
      if (self.prop.page_all > 1) {
        self.prop.page_all = 1;
        self.prop.is_paging = true;
        self._suggest(self);
      }
    } else {
      if (self.prop.page_suggest > 1) {
        self.prop.page_suggest = 1;
        self.prop.is_paging = true;
        self._suggest(self);
      }
    }
  },

  /**
   * @private
   * @desc 前のページを表示する
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _prevPage: function(self) {
    if (!self.prop.is_suggest) {
      if (self.prop.page_all > 1) {
        self.prop.page_all--;
        self.prop.is_paging = true;
        self._suggest(self);
      }
    } else {
      if (self.prop.page_suggest > 1) {
        self.prop.page_suggest--;
        self.prop.is_paging = true;
        self._suggest(self);
      }
    }
  },

  /**
   * @private
   * @desc 次のページを表示する
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _nextPage: function(self) {
    if (self.prop.is_suggest) {
      if (self.prop.page_suggest < self.prop.max_suggest) {
        self.prop.page_suggest++;
        self.prop.is_paging = true;
        self._suggest(self);
      }
    } else {
      if (self.prop.page_all < self.prop.max_all) {
        self.prop.page_all++;
        self.prop.is_paging = true;
        self._suggest(self);
      }
    }
  },

  /**
   * @private
   * @desc 最後のページを表示する
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _lastPage: function(self) {
    if (!self.prop.is_suggest) {
      if (self.prop.page_all < self.prop.max_all) {
        self.prop.page_all = self.prop.max_all;
        self.prop.is_paging = true;
        self._suggest(self);
      }
    } else {
      if (self.prop.page_suggest < self.prop.max_suggest) {
        self.prop.page_suggest = self.prop.max_suggest;
        self.prop.is_paging = true;
        self._suggest(self);
      }
    }
  }
};