/*global $*/
/** @lends external:jQuery.ajaxComboBox.prototype */
export default {
  /**
   * @private
   * @desc データベースもしくは連想配列から検索する
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _suggest: function(self) {
    // コンボボックスの種類によって検索文字列の形式を変える
    var q_word;
    if (self.option.plugin_type != 'textarea') {
      q_word = (self.prop.is_suggest) ? $.trim($(self.elem.combo_input).val()) : '';
      if (q_word.length < 1 && self.prop.is_suggest) {
        self._hideResults(self);
        return;
      }
      q_word = q_word.split(/[\s　]+/);
    } else {
      q_word = [self.prop.tag.str];
    }

    self._abortAjax(self);
    self._setLoading(self);
    $(self.elem.sub_info).children('dl').hide(); // サブ情報消去

    // ここで、本来は真偽値が格納される変数に数値を格納している。
    if (self.prop.is_paging) {
      var obj = self._getCurrentLine(self);
      self.prop.is_paging = (obj) ? $(self.elem.results).children('li').index(obj) : -1;
    } else if (!self.prop.is_suggest) {
      self.prop.is_paging = 0;
    }
    var which_page_num = (self.prop.is_suggest) ? self.prop.page_suggest : self.prop.page_all;

    // データ取得
    if (typeof self.option.source == 'object') self._searchForJson(self, q_word, which_page_num);
    else                                       self._searchForDb(self, q_word, which_page_num);
  },

  /**
   * @private
   * @desc ローディング画像を表示する
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _setLoading: function(self) {
    $(self.elem.navi_info).text(self.message.loading);
    if ($(self.elem.results).html() === '') {
      $(self.elem.navi).children('p').empty();
      self._calcWidthResults(self);
      $(self.elem.container).addClass(self.css_class.container_open);
    }
  }
};