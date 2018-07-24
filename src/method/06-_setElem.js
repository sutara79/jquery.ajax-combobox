/*global $*/
/** @lends external:jQuery.ajaxComboBox.prototype */
export default {
  /**
   * @private
   * @desc HTML要素を修正、生成する
   * @param {Object} combo_input - プラグイン適用の対象とされたHTML要素
   */
  _setElem: function(combo_input) {
    // 1. 要素を修正、生成する
    // 本体
    var elem = {};
    elem.combo_input = $(combo_input)
      .attr('autocomplete', 'off')
      .addClass(this.css_class.input)
      .wrap('<div>'); // This "div" is "container".

    elem.container = $(elem.combo_input).parent().addClass(this.css_class.container);
    if (this.option.plugin_type == 'combobox') {
      elem.button = $('<div>').addClass(this.css_class.button);

      // button_img がHTML要素の場合とsrc属性の場合とで分岐させる
      elem.img = (this.option.button_img.match(/^</)) ?
                    $(this.option.button_img) :
                    $('<img>').attr('src', this.option.button_img);
    } else {
      elem.button = false;
      elem.img    = false;
    }
    // サジェストリスト
    elem.result_area = $('<div>').addClass(this.css_class.re_area);
    elem.navi        = $('<div>').addClass(this.css_class.navi);
    elem.navi_info   = $('<div>').addClass('info');
    elem.navi_p      = $('<p>');
    elem.results     = $('<ul>' ).addClass(this.css_class.results);
    elem.sub_info    = $('<div>').addClass(this.css_class.sub_info);
    // primary_keyカラムの値を送信するための"input:hidden"を作成
    if (this.option.plugin_type == 'textarea') {
      elem.hidden = false;
    } else {
      var hidden_name = ($(elem.combo_input).attr('name') !== undefined) ?
        $(elem.combo_input).attr('name') :
        $(elem.combo_input).attr('id');
      // CakePHP用の対策 例:data[search][user] -> data[search][user_primary_key]
      if (hidden_name.match(/\]$/)) {
        hidden_name = hidden_name.replace(/\]?$/, '_primary_key]');
      } else {
        hidden_name += '_primary_key';
      }
      elem.hidden = $('<input type="hidden" />')
        .attr({
          name: hidden_name,
          id: hidden_name
        })
        .val('');
    }

    // 2. 要素をHTML内に配置する
    switch (this.option.plugin_type) {
      case 'combobox':
        $(elem.container)
          .append(elem.button)
          .append(elem.result_area)
          .append(elem.hidden);
        $(elem.button).append(elem.img);
        break;
      
      case 'simple':
        $(elem.container)
          .append(elem.result_area)
          .append(elem.hidden);
        break;
      
      case 'textarea':
        $(elem.container)
          .append(elem.result_area);
    }
    $(elem.result_area)
      .append(elem.navi)
      .append(elem.results)
      .append(elem.sub_info);
    $(elem.navi)
      .append(elem.navi_info)
      .append(elem.navi_p);

    // 3. サイズ調整
    // ComboBoxの幅
    if (this.option.plugin_type == 'combobox') {
      $(elem.container).width($(elem.combo_input).outerWidth() + $(elem.button).outerWidth());
    } else {
      $(elem.container).width($(elem.combo_input).outerWidth());
    }

    this.elem = elem;
  },

  /**
   * @private
   * @desc 画面表示の初期状態を決める
   */
  _setButtonAttrDefault: function() {
    if (this.option.select_only) {
      if ($(this.elem.combo_input).val() !== '') {
        if (this.option.plugin_type != 'textarea') {
          if ($(this.elem.hidden).val() !== '') {
            // 選択状態
            $(this.elem.combo_input)
              .attr('title',this.message.select_ok)
              .removeClass(this.css_class.select_ng)
              .addClass(this.css_class.select_ok);
          } else {
            // 入力途中
            $(this.elem.combo_input)
              .attr('title',this.message.select_ng)
              .removeClass(this.css_class.select_ok)
              .addClass(this.css_class.select_ng);
          }
        }
      } else {
        // 完全な初期状態へ戻す
        if (this.option.plugin_type != 'textarea') $(this.elem.hidden).val('');
        $(this.elem.combo_input)
          .removeAttr('title')
          .removeClass(this.css_class.select_ng);
      }
    }
    if (this.option.plugin_type == 'combobox') {
      $(this.elem.button).attr('title', this.message.get_all_btn);
      // $(this.elem.img).attr('src', this.option.button_img);
    }
  }
};