/*global $*/
/** @lends external:jQuery.ajaxComboBox.prototype */
export default {
  /**
   * @private
   * @desc CSSクラスの名前を設定する
   */
  _setCssClass: function() {
    // 各モード共通
    var css_class = {
      container      : 'ac_container', // ComboBoxを包むdivタグ
      container_open : 'ac_container_open',
      selected       : 'ac_selected',
      re_area        : 'ac_result_area', // 結果リストの<div>
      navi           : 'ac_navi', // ページナビを囲む<div>
      results        : 'ac_results', // 候補一覧を囲む<ul>
      re_off         : 'ac_results_off', // 候補一覧(非選択状態)
      select         : 'ac_over', // 選択中の<li>
      sub_info       : 'ac_subinfo', // サブ情報
      select_ok      : 'ac_select_ok',
      select_ng      : 'ac_select_ng',
      input_off      : 'ac_input_off' // 非選択状態
    };
    switch (this.option.plugin_type) {
      case 'combobox':
        css_class = $.extend(css_class, {
          button  : 'ac_button', // ボタンのCSSクラス
          btn_on  : 'ac_btn_on', // ボタン(mover時)
          btn_out : 'ac_btn_out', // ボタン(mout時)
          input   : 'ac_input' // テキストボックス
        });
        break;

      case 'simple':
        css_class = $.extend(css_class, {
          input: 'ac_s_input' // テキストボックス
        });
        break;

      case 'textarea':
        css_class = $.extend(css_class, {
          input         : 'ac_textarea', // テキストボックス
          btn_short_off : 'ac_btn_short_off'
        });
        break;
    }
    this.css_class = css_class;
  },

  /**
   * @private
   * @desc 雑多なプロパティをひとまとめにして扱う
   */
  _setProp: function() {
    this.prop = {
      timer_valchange: false, // タイマー変数(一定時間ごとに入力値の変化を監視)
      is_suggest: false, // リストのタイプ。false=>全件 / true=>予測
      page_all: 1,  // 全件表示の際の、現在のページ番号
      page_suggest: 1, // 候補表示の際の、現在のページ番号
      max_all: 1,  // 全件表示の際の、全ページ数
      max_suggest: 1, // 候補表示の際の、全ページ数
      is_paging: false, // ページ移動か?
      is_loading: false, // Ajaxで問い合わせ中かどうか？
      reserve_btn: false, // ボタンの背景色変更の予約があるかどうか？
      reserve_click: false, // マウスのキーを押し続ける操作に対応するためmousedownを検知
      xhr: false, // XMLHttpオブジェクトを格納
      key_paging: false, // キーでページ移動したか？
      key_select: false, // キーで候補移動したか？？
      prev_value: '', // 初期値

      // サブ情報
      size_navi: null, // サブ情報表示用(ページナビの高さ)
      size_results: null, // サブ情報表示用(リストの上枠線)
      size_li: null, // サブ情報表示用(候補一行分の高さ)
      size_left: null, // サブ情報表示用(リストの横幅)
      
      // タグ検索
      tag: null
    };
  }
};