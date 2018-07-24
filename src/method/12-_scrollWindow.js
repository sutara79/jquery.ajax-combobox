/*global $*/
/** @lends external:jQuery.ajaxComboBox.prototype */
export default {
  /**
   * @private
   * @desc 選択候補を追いかけて画面をスクロールさせる。
   *       (キー操作による候補移動、ページ移動のみに適用)
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   * @param {boolean} enforce - 移動先をテキストボックスに強制するかどうかの真偽値
   */
  _scrollWindow: function(self, enforce) {
    // 使用する変数を定義
    var current_result = self._getCurrentLine(self);

    var target_top = (current_result && !enforce) ?
      current_result.offset().top :
      $(self.elem.container).offset().top;

    var target_size;

    // サブ情報を表示する場合は、その高さを考慮に入れる
    if (self.option.sub_info) {
      var dl = $(self.elem.sub_info).children('dl:visible');
      target_size =
        $(dl).height() +
        parseInt($(dl).css('border-top-width')) +
        parseInt($(dl).css('border-bottom-width'));
    } else {
      self.prop.size_li = $(self.elem.results).children('li:first').outerHeight();
      target_size = self.prop.size_li;
    }
    var client_height = $(window).height();
    var scroll_top = $(window).scrollTop();
    var scroll_bottom = scroll_top + client_height - target_size;

    // スクロール処理
    var gap;
    if ($(current_result).length) {
      if (target_top < scroll_top || target_size > client_height) {
        // 上へスクロール
        // ※ブラウザの高さがターゲットよりも低い場合もこちらへ分岐する。
        gap = target_top - scroll_top;
      } else if (target_top > scroll_bottom) {
        // 下へスクロール
        gap = target_top - scroll_bottom;
      } else {
        // スクロールは行われない
        return;
      }
    } else if (target_top < scroll_top) {
      gap = target_top - scroll_top;
    }
    window.scrollBy(0, gap);
  },

  /**
   * @private
   * @desc 候補リスト:暗い、入力欄:明瞭、サブ情報:隠す
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _setCssFocusedInput: function(self) {
    $(self.elem.results).addClass(self.css_class.re_off);
    $(self.elem.combo_input).removeClass(self.css_class.input_off);
    $(self.elem.sub_info).children('dl').hide();
  },

  /**
   * @private
   * @desc 候補リスト:明瞭、入力欄:暗い
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _setCssFocusedResults: function(self) {
    $(self.elem.results).removeClass(self.css_class.re_off);
    $(self.elem.combo_input).addClass(self.css_class.input_off);
  },

  /**
   * @private
   * @desc URL短縮ボタンを使用可能にする
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _enableButtonShort: function(self) {
    $(self.option.shorten_btn)
      .removeClass(self.css_class.btn_short_off)
      .removeAttr('disabled');
  },

  /**
   * @private
   * @desc URL短縮ボタンを使用不可にする
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _disableButtonShort: function(self) {
    $(self.option.shorten_btn)
      .addClass(self.css_class.btn_short_off)
      .attr('disabled', 'disabled');
  }
};