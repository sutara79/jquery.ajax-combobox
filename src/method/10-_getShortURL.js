/*global $*/
/** @lends external:jQuery.ajaxComboBox.prototype */
export default {
  /**
   * @private
   * @desc 外部サービスを利用してURLを短縮する
   */
  _getShortURL: function(self) {
    // テキストエリアを入力禁止に
    $(self.elem.combo_input).attr('disabled', 'disabled');

    var text = $(self.elem.combo_input).val(); // Ajax後も使用する
    var matches = []; // 結果を最終的に格納する
    var arr = null; // ループの中で一時的に使用

    while ((arr = self.option.shorten_reg.exec(text)) !== null) {
      matches[matches.length] = arr[1];
    }
    // URLがなければ、ここで終了。
    // ボタンが表示された直後に文章が変更された場合などに対応
    if (matches.length < 1) {
      // テキストエリアを入力可能に
      $(self.elem.combo_input).removeAttr('disabled');
      return;
    }
    // 可変長オブジェクトを引数にする
    var obj_param = {};
    for (var i = 0; i < matches.length; i++) {
      obj_param['p_' + i] = matches[i];
    }
    // bitlyへ送信
    $.ajax({
      dataType: 'json',
      url: self.option.shorten_src,
      data: obj_param,
      success: function (json) {
        // 元URLと短縮URLを順番に置換する
        var i = 0;
        var result = text.replace(self.option.shorten_reg, function() {
          var matched = arguments[0].replace(arguments[1], json[i]);
          i++;
          return matched;
        });
        // 画面を整える
        $(self.elem.combo_input).val(result);
        self.prop.prev_value = result;
        self._disableButtonShort(self);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        self._ajaxErrorNotify(self, errorThrown);
      },
      complete: function() {
        // テキストエリアを入力可能に
        $(self.elem.combo_input).removeAttr('disabled').focus();
      }
     });
  },

  /**
   * @private
   * @desc Ajax通信が失敗した場合の処理
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   * @errorThrom {string} errorThrown - サーバから返されたエラーメッセージ
   */
  _ajaxErrorNotify: function(self, errorThrown) {
    //TODO: アラート表示ではなく、結果リストを流用して表示する。
    //TODO: errorThrownを活用する。
    alert(self.message.ajax_error);
  }
};