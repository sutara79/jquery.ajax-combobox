/*global $*/
/** @lends external:jQuery.ajaxComboBox.prototype */
export default {
  /**
   * @private
   * @desc イベントハンドラ: ボタン
   */
  _ehButton: function() {
    if (this.option.plugin_type != 'combobox') return;

    var self = this;
    $(self.elem.button)
      .mouseup(function(ev) {
        if ($(self.elem.result_area).is(':hidden')) {
          clearInterval(self.prop.timer_valchange);
          self.prop.is_suggest = false;
          self._suggest(self);
          $(self.elem.combo_input).focus();
        } else {
          self._hideResults(self);
        }
        ev.stopPropagation();
      })
      .mouseover(function() {
        $(self.elem.button)
          .addClass(self.css_class.btn_on)
          .removeClass(self.css_class.btn_out);
      })
      .mouseout(function() {
        $(self.elem.button)
          .addClass(self.css_class.btn_out)
          .removeClass(self.css_class.btn_on);
      }).mouseout(); // default: mouseout
  },

  /**
   * @private
   * @desc イベントハンドラ: コンボボックスの入力欄
   */
  _ehComboInput: function() {
    var self = this;
    $(self.elem.combo_input).keydown(function(ev) {
      self._processKey(self, ev);
    });
    $(self.elem.combo_input)
      .focus(function() {
        self._setTimerCheckValue(self);
      })
      .click(function() {
        self._setCssFocusedInput(self);
        $(self.elem.results).children('li').removeClass(self.css_class.select);
      });
  },

  /**
   * @private
   * @desc イベントハンドラ: コンボボックス全体
   */
  _ehWhole: function() {
    var self = this;
    var stop_hide = false; // このプラグイン内でのマウスクリックなら、ページ全体での候補消去を中止。
    $(self.elem.container).mousedown(function() {
      stop_hide = true;
    });
    $('html').mousedown(function() {
      if (stop_hide) stop_hide = false;
      else           self._hideResults(self);
    });
  },

  /**
   * @private
   * @desc イベントハンドラ: 検索結果リスト
   */
  _ehResults: function() {
    var self = this;
    $(self.elem.results)
      .children('li')
      .mouseover(function() {
        // Firefoxでは、候補一覧の上にマウスカーソルが乗っていると
        // うまくスクロールしない。そのための対策。 イベント中断。
        if (self.prop.key_select) {
          self.prop.key_select = false;
          return;
        }
        self._setSubInfo(self, this);

        $(self.elem.results).children('li').removeClass(self.css_class.select);
        $(this).addClass(self.css_class.select);
        self._setCssFocusedResults(self);
      })
      .click(function(e) {
        // Firefoxでは、候補一覧の上にマウスカーソルが乗っていると
        // うまくスクロールしない。そのための対策。イベント中断。
        if (self.prop.key_select) {
          self.prop.key_select = false;
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        self._selectCurrentLine(self, false);
      });
  },

  /**
   * @private
   * @desc イベントハンドラ: ページング部分
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _ehNaviPaging: function(self) {
    // "<< 1"
    $(self.elem.navi).find('.navi_first').mouseup(function(ev) {
      $(self.elem.combo_input).focus();
      ev.preventDefault();
      self._firstPage(self);
    });

    // "< prev"
    $(self.elem.navi).find('.navi_prev').mouseup(function(ev) {
      $(self.elem.combo_input).focus();
      ev.preventDefault();
      self._prevPage(self);
    });

    // the number of page
    $(self.elem.navi).find('.navi_page').mouseup(function(ev) {
      $(self.elem.combo_input).focus();
      ev.preventDefault();

      if (!self.prop.is_suggest) self.prop.page_all     = parseInt($(this).text(), 10);
      else                       self.prop.page_suggest = parseInt($(this).text(), 10);

      self.prop.is_paging = true;
      self._suggest(self);
    });

    // "next >"
    $(self.elem.navi).find('.navi_next').mouseup(function(ev) {
      $(self.elem.combo_input).focus();
      ev.preventDefault();
      self._nextPage(self);
    });

    // "last >>"
    $(self.elem.navi).find('.navi_last').mouseup(function(ev) {
      $(self.elem.combo_input).focus();
      ev.preventDefault();
      self._lastPage(self);
    });
  },

  /**
   * @private
   * @desc イベントハンドラ: テキストエリア
   */
  _ehTextArea: function() {
    var self = this;
    if (!self.option.shorten_btn) return;
    // URL短縮用ボタン
    $(self.option.shorten_btn).click(function() {
      self._getShortURL(self);
    });
  }
};