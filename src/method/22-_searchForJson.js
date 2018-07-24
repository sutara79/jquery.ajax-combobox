/*global $*/
/** @lends external:jQuery.ajaxComboBox.prototype */
export default {
  /**
   * @private
   * @desc 連想配列に対して検索する
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   * @param {Array} q_word - 検索文字列を収めた配列
   * @param {number} which_page_num - ページ番号
   */
  _searchForJson: function(self, q_word, which_page_num) {
    var matched = [];
    var esc_q = [];
    var sorted = [];
    var json = {};
    var i = 0;
    var arr_reg = [];

    do { // 全件表示のため、do-while文を使う。
      // 正規表現のメタ文字をエスケープ
      esc_q[i] = q_word[i].replace(/\W/g,'\\$&').toString();
      arr_reg[i] = new RegExp(esc_q[i], 'gi');
      i++;
    } while (i < q_word.length);

    // SELECT * FROM source WHERE field LIKE q_word;
    for (var i = 0; i < self.option.source.length; i++) {
      var flag = false;
      for (var j = 0; j < arr_reg.length; j++) {
        if (self.option.source[i][self.option.field].match(arr_reg[j])) {
          flag = true;
          if (self.option.and_or == 'OR') break;
        } else {
          flag = false;
          if (self.option.and_or == 'AND') break;
        }
      }
      if (flag) matched.push(self.option.source[i]);
    }

    // 見つからなければすぐに終了
    if (matched.length === undefined) {
      self._notFoundSearch(self);
      return;
    }
    json.cnt_whole = matched.length;

    // (CASE WHEN ...)の後に続く order 指定
    var reg1 = new RegExp('^' + esc_q[0] + '$', 'gi');
    var reg2 = new RegExp('^' + esc_q[0], 'gi');
    var matched1 = [];
    var matched2 = [];
    var matched3 = [];
    for (var i = 0; i < matched.length; i++) {
      if (matched[i][self.option.order_by[0][0]].match(reg1)) {
        matched1.push(matched[i]);
      } else if (matched[i][self.option.order_by[0][0]].match(reg2)) {
        matched2.push(matched[i]);
      } else {
        matched3.push(matched[i]);
      }
    }

    if (self.option.order_by[0][1].match(/^asc$/i)) {
      matched1 = self._sortAsc(self, matched1);
      matched2 = self._sortAsc(self, matched2);
      matched3 = self._sortAsc(self, matched3);
    } else {
      matched1 = self._sortDesc(self, matched1);
      matched2 = self._sortDesc(self, matched2);
      matched3 = self._sortDesc(self, matched3);
    }
    sorted = sorted.concat(matched1).concat(matched2).concat(matched3);

    // LIMIT xx OFFSET xx
    var start = (which_page_num - 1) * self.option.per_page;
    var end   = start + self.option.per_page;

    // 最終的に返るオブジェクトを作成
    for (var i = start, sub = 0; i < end; i++, sub++) {
      if (sorted[i] === undefined) break;
      for (var key in sorted[i]) {
        // セレクト専用
        if (key == self.option.primary_key) {
          if (json.primary_key === undefined) json.primary_key = [];
          json.primary_key.push(sorted[i][key]);
        }
        if (key == self.option.field) {
          // 変換候補を取得
          if (json.candidate === undefined) json.candidate = [];
          json.candidate.push(sorted[i][key]);
        } else {
          // サブ情報
          if ($.inArray(key, self.option.hide_field) == -1) {
            if (
              self.option.show_field !== '' &&
              $.inArray('*', self.option.show_field) == -1 &&
              $.inArray(key, self.option.show_field) == -1
            ) {
              continue;
            }
            if (json.subinfo === undefined) json.subinfo = [];
            if (json.subinfo[sub] === undefined) json.subinfo[sub] = [];
            json.subinfo[sub][key] = sorted[i][key];
          }
        }
      }
    }
    // json.cnt_page = json.candidate.length;
    if (json.candidate === undefined) json.candidate = [];
    json.cnt_page = json.candidate.length;
    self._prepareResults(self, json, q_word, which_page_num);
  }
};