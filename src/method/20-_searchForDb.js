/*global $*/
/** @lends external:jQuery.ajaxComboBox.prototype */
export default {
  /**
   * @private
   * @desc データベースに対して検索する
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   * @param {Array} q_word - 検索文字列を収めた配列
   * @param {number} which_page_num - ページ番号
   */
  _searchForDb: function(self, q_word, which_page_num) {
    self.prop.xhr = $.ajax({
      dataType: 'json',
      url: self.option.source,
      data: {
        q_word: q_word,
        page_num: which_page_num,
        per_page: self.option.per_page,
        search_field: self.option.search_field,
        and_or: self.option.and_or,
        order_by: self.option.order_by,
        db_table: self.option.db_table
      },
      success: function(json) {
        json.candidate   = [];
        json.primary_key = [];
        json.subinfo     = [];
        if (typeof json.result != 'object') {
          // 検索結果はゼロだった。
          self.prop.xhr = null;
          self._notFoundSearch(self);
          return;
        }
        json.cnt_page = json.result.length;
        for (var i = 0; i < json.cnt_page; i++) {
          json.subinfo[i] = [];
          for (var key in json.result[i]) {
            if (key == self.option.primary_key) {
              json.primary_key.push(json.result[i][key]);
            }
            if (key == self.option.field) {
              json.candidate.push(json.result[i][key]);
            } else if ($.inArray(key, self.option.hide_field) == -1) {
              if (self.option.show_field !== '' &&
                  $.inArray('*', self.option.show_field) == -1 &&
                  $.inArray(key, self.option.show_field) == -1) {
                continue;
              } else {
                json.subinfo[i][key] = json.result[i][key];
              }
            }
          }
        }
        delete(json.result);
        self._prepareResults(self, json, q_word, which_page_num);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        // このAjax通信のみ、プラグインが故意に通信を中断する場合がある。
        // その場合は警告を表示させない。
        if (textStatus != 'abort') {
          self._hideResults(self);
          self._ajaxErrorNotify(self, errorThrown);
        }
      },
      complete: function() { self.prop.xhr = null; }
    });
  }
};