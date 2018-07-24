/*global $*/
/** @lends external:jQuery.ajaxComboBox.prototype */
export default {
  /**
   * @private
   * @desc 候補一覧の<ul>成形、表示
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   * @param {Array} arr_candidate - DBから検索・取得した値の配列
   * @param {Array} arr_subinfo - サブ情報の配列
   * @param {Array} arr_primary_key - 主キーの配列
   */
  _displayResults: function(self, arr_candidate, arr_subinfo, arr_primary_key) {
    // 候補リストを、一旦リセット
    $(self.elem.results).empty();
    $(self.elem.sub_info).empty();
    for (var i = 0; i < arr_candidate.length; i++) {

      // 候補リスト
      var list = $('<li>')
        .text(arr_candidate[i]) // XSS対策
        .attr({
          pkey: arr_primary_key[i],
          title: arr_candidate[i]
        });

      if (
        self.option.plugin_type != 'textarea' &&
        arr_primary_key[i] == $(self.elem.hidden).val()
      ) {
        $(list).addClass(self.css_class.selected);
      }
      $(self.elem.results).append(list);

      // サブ情報のdlを生成
      if (arr_subinfo) {
        // sub_info属性にJSON文字列そのままを格納
        var str_subinfo = [];
        var $dl = $('<dl>');
        // テーブルの各行を生成
        var dt, dd;
        for (var key in arr_subinfo[i]) {
          // sub_info属性の値を整える
          var json_key = key.replace('\'', '\\\'');

          if (arr_subinfo[i][key] === null) {
            // DBのデータ値がnullの場合の対処
            arr_subinfo[i][key] = '';
          } else {
            // DBのデータ値が数値の場合の対処
            arr_subinfo[i][key] += '';
          }
          var json_val = arr_subinfo[i][key].replace('\'', '\\\'');

          str_subinfo.push("'" + json_key + "':" + "'" + json_val + "'");

          // If alias exists, set to the text-content of <dt>
          dt = (self.option.sub_as[key]) ? self.option.sub_as[key] : key;
          dt = $('<dt>').text(dt); // for XSS
          if (self.option.sub_info == 'simple') {
            $(dt).addClass('hide');
          }
          $dl.append(dt);

          dd = $('<dd>').text(arr_subinfo[i][key]); // for XSS
          $dl.append(dd);
        }
        // sub_info属性を候補リストのliに追加
        str_subinfo = '{' + str_subinfo.join(',') + '}';
        $(list).attr('sub_info', str_subinfo);
        
        $(self.elem.sub_info).append($dl);
        if (self.option.sub_info == 'simple' && $dl.children('dd').text() === '') {
          $dl.addClass('ac_dl_empty');
        }
      }
    }
    // サジェスト結果表示
    // 表示のたびに、結果リストの位置を調整しなおしている。
    // このプラグイン以外でページ内の要素の位置をずらす処理がある場合に対処するため。
    self._calcWidthResults(self);

    $(self.elem.container).addClass(self.css_class.container_open);
    self._ehResults(); // イベントハンドラ設定

    // ボタンのtitle属性変更(閉じる)
    if (self.option.plugin_type == 'combobox') $(self.elem.button).attr('title', self.message.close_btn);
  },

  /**
   * @private
   * @desc 候補一覧の幅を算出する
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _calcWidthResults: function(self) {
    // 候補の幅とトップ位置を再計算 (textareaがリサイズされることに対処するため)
    // ComboBoxの幅
    var w;
    if (self.option.plugin_type == 'combobox') {
      w = $(self.elem.combo_input).outerWidth() + $(self.elem.button).outerWidth();
    } else {
      w = $(self.elem.combo_input).outerWidth();
    }
    $(self.elem.container).width(w);
    
    // containerのpositionの値に合わせてtop,leftを設定する。
    if ($(self.elem.container).css('position') == 'static') {
      // position: static
      var offset = $(self.elem.combo_input).offset();
      $(self.elem.result_area).css({
        top: offset.top + $(self.elem.combo_input).outerHeight() + 'px',
        left: offset.left + 'px'
      });
    } else {
      // position: relative, absolute, fixed
      $(self.elem.result_area).css({
        top: $(self.elem.combo_input).outerHeight() + 'px',
        left: '0px'
      });
    }
    // 幅を設定した後、表示する。
    $(self.elem.result_area)
      .width(
        $(self.elem.container).width() -
        ($(self.elem.result_area).outerWidth() - $(self.elem.result_area).innerWidth())
      )
      .show();
  },

  /**
   * @private
   * @desc 候補一覧を消去する
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _hideResults: function(self) {
    if (self.prop.key_paging) {
      self._scrollWindow(self, true);
      self.prop.key_paging = false;
    }
    self._setCssFocusedInput(self);

    $(self.elem.results).empty();
    $(self.elem.sub_info).empty();
    $(self.elem.result_area).hide();
    $(self.elem.container).removeClass(self.css_class.container_open);

    self._abortAjax(self);
    self._setButtonAttrDefault(); // ボタンのtitle属性初期化
  }
};