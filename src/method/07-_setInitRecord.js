/*global $*/
/** @lends external:jQuery.ajaxComboBox.prototype */
export default {
  /**
   * @private
   * @desc ComboBoxに初期値を挿入する
   */
  _setInitRecord: function() {
    if (this.option.init_record === false) return;
    // セレクト専用への値を挿入する
    // hiddenへ値を挿入
    if (this.option.plugin_type != 'textarea') $(this.elem.hidden).val(this.option.init_record);

    // テキストボックスへ値を挿入
    if (typeof this.option.source == 'object') {
      // sourceがデータセットの場合
      var data;
      for (var i = 0; i < this.option.source.length; i++) {
        if (this.option.source[i][this.option.primary_key] == this.option.init_record) {
          data = this.option.source[i];
          break;
        }
      }
      this._afterInit(this, data);
    } else {
      var self = this;
      $.ajax({
        dataType: 'json',
        url: self.option.source,
        data: {
          db_table: this.option.db_table,
          pkey_name: this.option.primary_key,
          pkey_val: this.option.init_record
        },
        success: function (json) {
          self._afterInit(self, json);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          self._ajaxErrorNotify(self, errorThrown);
        }
      });
    }
  },

  /**
   * @private
   * @desc 初期化用Ajax通信後の処理
   * @param {Object} self - このクラスのインスタンスオブジェクト
   * @param {Object} data - サーバからのレスポンス
   */
  _afterInit: function(self, data) {
    $(self.elem.combo_input).val(data[self.option.field]);
    if (self.option.plugin_type != 'textarea') $(self.elem.hidden).val(data[self.option.primary_key]);
    self.prop.prev_value = data[self.option.field];
    if (self.option.select_only) {
      // 選択状態
      $(self.elem.combo_input)
        .attr('title',self.message.select_ok)
        .removeClass(self.css_class.select_ng)
        .addClass(self.css_class.select_ok);
    }
  }
};