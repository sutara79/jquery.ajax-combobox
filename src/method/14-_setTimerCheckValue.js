/*global $*/
/** @lends external:jQuery.ajaxComboBox.prototype */
export default {
  /**
   * @private
   * @desc 入力値変化の監視をタイマーで予約する
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _setTimerCheckValue: function(self) {
    self.prop.timer_valchange = setTimeout(function() {
      self._checkValue(self);
    }, 500);
  },

  /**
   * @private
   * @desc 入力値変化の監視を実行する
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _checkValue: function(self) {
    var now_value = $(self.elem.combo_input).val();
    if (now_value != self.prop.prev_value) {
      self.prop.prev_value = now_value;
      if (self.option.plugin_type == 'textarea') {
        // URLを探し、短縮ボタンを表示または非表示にする
        self._findUrlToShorten(self);

        // タグとして検索すべき文字列を探す
        var tag = self._findTag(self, now_value);
        if (tag) {
          self._setTextAreaNewSearch(self, tag);
          self._suggest(self);
        }
      } else {
        // sub_info属性を削除
        $(self.elem.combo_input).removeAttr('sub_info');

        // hiddenの値を削除
        if (self.option.plugin_type != 'textarea') $(self.elem.hidden).val('');

        // セレクト専用時
        if (self.option.select_only) self._setButtonAttrDefault();

        // ページ数をリセット
        self.prop.page_suggest = 1;
        self.prop.is_suggest = true;
        self._suggest(self);
      }
    } else if (
      // textareaで、現在のタグから別のタグへ移動していないか検査する
      self.option.plugin_type == 'textarea' &&
      $(self.elem.result_area).is(':visible')
    ) {
      var new_tag = self._findTag(self, now_value);
      if (!new_tag) {
        self._hideResults(self);
      } else if (
        new_tag.str != self.prop.tag.str ||
        new_tag.pos_left != self.prop.tag.pos_left
      ) {
        self._setTextAreaNewSearch(self, new_tag);
        self._suggest(self);
      }
    }
    // 一定時間ごとの監視を再開
    self._setTimerCheckValue(self);
  },

  /**
   * @private
   * @desc 現在のテキストエリアの値をもとに、検索オプションを決める
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   * @param {Object} tag - タグ1種類分の情報を格納した連想配列
   */
  _setTextAreaNewSearch: function (self, tag) {
    self.prop.tag             = tag;
    self.prop.page_suggest    = 1;
    self.option.search_field  = self.option.tags[self.prop.tag.type].search_field;
    self.option.order_by      = self.option.tags[self.prop.tag.type].order_by;
    self.option.primary_key   = self.option.tags[self.prop.tag.type].primary_key;
    self.option.db_table      = self.option.tags[self.prop.tag.type].db_table;
    self.option.field         = self.option.tags[self.prop.tag.type].field;
    self.option.sub_info      = self.option.tags[self.prop.tag.type].sub_info;
    self.option.sub_as        = self.option.tags[self.prop.tag.type].sub_as;
    self.option.show_field    = self.option.tags[self.prop.tag.type].show_field;
    self.option.hide_field    = self.option.tags[self.prop.tag.type].hide_field;
  },

  /**
   * @private
   * @desc URLを探し、短縮ボタンを表示または非表示にする
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   * @param {Object} tag - タグ1種類分の情報を格納した連想配列
   */
  _findUrlToShorten: function(self) {
    var flag = null;
    var arr  = null; // ループの中で一時的に使用
    while ((arr = self.option.shorten_reg.exec($(self.elem.combo_input).val())) !== null) {
      flag = true;
      self.option.shorten_reg.lastIndex = 0; // .exec() のループを中断する場合、必ずリセットしておくこと
      break;
    }
    if (flag) self._enableButtonShort(self);
    else self._disableButtonShort(self);
  },

  /**
   * @private
   * @desc キャレット位置周辺の文字列(タグ)を抜き出す
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   * @param {string} now_value - テキストエリア全文
   * @return {Array} - キャレット位置周辺の文字列と、抜き出す範囲(左、右)のオブジェクト配列
   */
  _findTag: function(self, now_value) {
    // キャレット位置を取得
    var pos  = self._getCaretPosition($(self.elem.combo_input).get(0));

    // 抽出したタグの情報を保存する。
    var left, pos_left, right, pos_right, str;
    for (var i = 0; i < self.option.tags.length; i++) {
      // キャレット位置から左へ空白までを抜き出す
      left = now_value.substring(0, pos);
      left = left.match(self.option.tags[i].pattern.reg_left);
      if (!left) continue;
      left = left[1]; // 短縮していることに注意!
      pos_left = pos - left.length;
      if (pos_left < 0) pos_left = 0;

      // キャレット位置から右へ空白までを抜き出す
      right = now_value.substring(pos, now_value.length);
      right = right.match(self.option.tags[i].pattern.reg_right);
      if (right) {
        right = right[1]; // 短縮していることに注意!
        pos_right = pos + right.length;
      } else {
        right = '';
        pos_right = pos;
      }
      str = left + '' + right;
      self.prop.is_suggest = (str === '') ? false : true;
      return {
        type: i,
        str: str,
        pos_left: pos_left,
        pos_right: pos_right
      };
    }
    return false;
  },

  /**
   * @private
   * @desc キャレットの位置を取得
   * @param {Object} item - プラグイン呼び出し元の要素 "$(elem).get(0)"
   * @return {number} - キャレットの現在位置
   */
  _getCaretPosition: function(item) {
    var pos = 0;
    if (document.selection) {
      // IE
      item.focus();
      var obj_select = document.selection.createRange();
      obj_select.moveStart ("character", -item.value.length);
      pos = obj_select.text.length;
    } else if (item.selectionStart || item.selectionStart == "0") {
      // Firefox, Chrome
      pos = item.selectionStart;
    }
    return pos;
  },

  /**
   * @private
   * @desc 指定位置にキャレットを移動させる
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   * @param {number} pos - キャレットを移動させる位置
   */
  _setCaretPosition: function(self, pos) {
    var item = $(self.elem.combo_input).get(0);
    if (item.setSelectionRange) {
      // Firefox, Chrome
      item.focus();
      item.setSelectionRange(pos, pos);
    } else if (item.createTextRange) {
      // IE
      var range = item.createTextRange();
      range.collapse(true);
      range.moveEnd("character", pos);
      range.moveStart("character", pos);
      range.select();
    }
  }
};