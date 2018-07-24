/*global $*/
/** @lends external:jQuery.ajaxComboBox.prototype */
export default {
  /**
   * @private
   * @desc 現在選択中の候補に決定する
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   * @param {boolean} is_enter_key - Enterキーで決定されたかどうか
   */
  _selectCurrentLine: function(self, is_enter_key) {
    // 選択候補を追いかけてスクロール
    self._scrollWindow(self, true);

    var current = self._getCurrentLine(self);
    if (current) {
      if (self.option.plugin_type != 'textarea') {
        $(self.elem.combo_input).val($(current).text());

        // サブ情報があるならsub_info属性を追加・書き換え
        if (self.option.sub_info) {
          $(self.elem.combo_input).attr('sub_info', $(current).attr('sub_info'));
        }
        if (self.option.select_only) self._setButtonAttrDefault();
        $(self.elem.hidden).val($(current).attr('pkey'));
      } else {
        var left = self.prop.prev_value.substring(0, self.prop.tag.pos_left);
        var right = self.prop.prev_value.substring(self.prop.tag.pos_right);
        var ctext, p_len, l_len, pos;

        // 閉じカッコがあるタグの場合、rightの冒頭がその形式でない場合は追加する。
        // 前後にスペースを挿入するかどうかもここで判断する。
        // 行頭の場合はスペースは挿入しない。
        ctext = $(current).text();
        // 左側空白の補完
        if (
          self.option.tags[self.prop.tag.type].space[0] &&
          !left.match(self.option.tags[self.prop.tag.type].pattern.space_left)
        ) {
          p_len = self.option.tags[self.prop.tag.type].pattern.left.length;
          l_len = left.length;
          left = left.substring(0, (l_len - p_len)) +
            ' ' +
            left.substring((l_len - p_len));
        }
        // 右側カッコの補完
        if (!right.match(self.option.tags[self.prop.tag.type].pattern.comp_right)) {
          right = self.option.tags[self.prop.tag.type].pattern.right + right;
        }
        // 右側空白の補完
        if (
          self.option.tags[self.prop.tag.type].space[1] &&
          !right.match(self.option.tags[self.prop.tag.type].pattern.space_right)
        ) {
          p_len = self.option.tags[self.prop.tag.type].pattern.right.length;
          right = right.substring(0, p_len) +
            ' ' +
            right.substring(p_len);
        }
        $(self.elem.combo_input).val(left + '' + ctext + '' + right);
        pos = left.length + ctext.length;
        self._setCaretPosition(self, pos);
      }
      self.prop.prev_value = $(self.elem.combo_input).val();
      self._hideResults(self);
    }
    if (self.option.bind_to) {
      // 候補選択を引き金に、イベントを発火する
      $(self.elem.combo_input).trigger(self.option.bind_to, is_enter_key);
    }
    $(self.elem.combo_input).focus();  // テキストボックスにフォーカスを移す
    $(self.elem.combo_input).change(); // テキストボックスの値が変わったことを通知
    self._setCssFocusedInput(self);
  },

  /**
   * @private
   * @desc 現在選択中の候補の情報を取得する
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _getCurrentLine: function(self) {
    if ($(self.elem.result_area).is(':hidden')) return false;
    var obj = $(self.elem.results).children('li.' + self.css_class.select);
    if ($(obj).length) return obj;
    else               return false;
  }
};