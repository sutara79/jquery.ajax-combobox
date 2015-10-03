/**
 * @file jQuery Plugin: jquery.ajax-combobox
 * @version 7.4.4
 * @author Yuusaku Miyazaki <toumin.m7@gmail.com>
 * @license MIT License
 */
(function($) {

/**
 * @desc プラグインをjQueryのプロトタイプに追加する
 * @global
 * @memberof jQuery
 * @param {string|Object} source - サーバ側のプログラム、もしくは連想配列そのもの。
 * @param {Object} option - オプションを収めた連想配列。
 * @param {boolean} [option.instance] - プラグインを呼び出すとき、jQueryオブジェクトではなくインスタンスを返すかどうか
 * @param {string} [option.lang='ja'] - プラグインのメッセージに使われる言語。 ('ja', 'en', 'es' and 'pt-br')
 * @param {string} [option.db_table='tbl'] - 問い合わせるデータベースのテーブル。
 * @param {string} [option.field='name'] - JavaScript側での結果表示に用いるフィールド。
 * @param {string} [option.search_field=option.field] - 検索対象のフィールド名。カンマ区切りで複数指定可能。 (e.g.: 'id, name, job')
 * @param {string|Array} [option.order_by=option.search_field] - 並替の基準となるフィールド。配列でも可。 (e.g.: 'name DESC' or ['name ASC', 'age DESC'])
 * @param {number} [option.per_page=10] - 候補一覧の1ページあたりに表示する数。
 * @param {number} [option.navi_num=5] - ページナビで表示する、隣接ページの数。
 * @param {boolean} [option.navi_simple=false] - 先頭・末尾のページへのリンクを非表示にして、ComboBoxの幅をできるだけ狭くする。
 * @param {string} [option.plugin_type='combobox'] - 'combobox', 'simple', 'textarea'
 * @param {string} [option.init_record=false] - 初期値に指定するレコード。プライマリキーの値で指定する。 
 * @param {string} [option.bind_to] - 候補選択後に実行されるイベントの名前
 * @param {string} [option.and_or='AND'] - AND検索、もしくはOR検索 ('AND' or 'OR')
 * @param {boolean|string} [option.sub_info=false] - サブ情報を表示。'simple'と指定することで項目名を非表示にできる。 (true, false or 'simple')
 * @param {Objec} [option.sub_as={}] - サブ情報のフィールドの別名。連想配列で指定する。
 * @param {string} [option.show_field] - サブ情報で表示するフィールド。カンマ区切りで複数指定可能。 (e.g.: 'id' or 'id, job, age')
 * @param {string} [option.hide_field] - サブ情報で非表示にするフィールド。カンマ区切りで複数指定可能。 (e.g.: 'id' or 'id, job, age')
 * @param {boolean} [option.select_only=false] - セレクト専用にする。(データベースに登録された値しか受け入れない)
 * @param {string} [option.primary_key='id'] - セレクト専用時、Form の hidden の値に指定される、レコードを特定できるフィールド。
 * @param {string} [option.button_img='dist/btn.png'] - ボタンに使われる画像
 * @param {string} [option.shorten_btn] - (option.plugin_type='textarea' の場合に限り、)短縮実行ボタンのセレクタ。
 * @param {string} [option.shorten_src='dist/bitly.php'] - URL短縮を外部に依頼するスクリプトのパス。
 * @param {number} [option.shorten_min=20] - URL短縮を実行する最小の文字数。
 * @param {Object} [option.shorten_reg] - URLを検出するための正規表現。
 * @param {Array} [option.tags=false] - (option.plugin_type='textarea' の場合に限り、)タグ検索の設定。
 * @param {Array} [option.tags.pattern] - タグを囲む記号。開始文字と終了文字を配列で指定する。 (e.g.: pattern: [ '<', '>' ])
 * @param {Array} [option.tags.space] - タグ選択後に、前後に空白を挿入するかどうかを配列で指定する。
 * @param {string} [option.tags.db_table=option.db_table]
 * @param {string} [option.tags.field=option.field]
 * @param {string} [option.tags.search_field=option.search_field]
 * @param {string|Array} [option.tags.order_by=option.order_by]
 * @param {boolean|string} [option.tags.sub_info=option.sub_info]
 * @param {Object} [option.tags.sub_as=option.sub_as]
 * @param {string} [option.tags.show_field=option.show_field]
 * @param {string} [option.tags.hide_field=option.hide_field]
 */
$.fn.ajaxComboBox = function(source, option) {
  var arr = [];
  this.each(function() {
    arr.push(new AjaxComboBox(this, source, option));
  });
  return (option !== undefined && option.instance !== undefined && option.instance) ? $(arr) : this;
};

/**
 * @global
 * @constructor
 * @classdesc 要素ごとに適用される処理を集めたクラス
 * @param {Object} combo_input - プラグインを適用するHTML要素。
 * @param {string|Object} source - サーバ側のプログラム、もしくは連想配列そのもの。
 * @param {Object} option - オプションを収めた連想配列。
 */
function AjaxComboBox(combo_input, source, option) {
  this._setOption(source, option);
  this._setMessage();
  this._setCssClass();
  this._setProp();
  this._setElem(combo_input);

  this._setButtonAttrDefault();
  this._setInitRecord();

  this._ehButton();
  this._ehComboInput();
  this._ehWhole();
  this._ehTextArea();

  if (this.option.shorten_btn) this._findUrlToShorten(this);
}

$.extend(AjaxComboBox.prototype, /** @lends AjaxComboBox.prototype */ {
  /**
   * @private
   * @desc オプションの初期化
   * @param {string|Object} source - サーバサイド言語へのパス、またはデータそのものの連想配列
   * @param {Object} option - 連想配列の形式のオプション
   */
  _setOption: function(source, option) {
    option = this._setOption1st(source, option);
    option = this._setOption2nd(option);
    this.option = option;
  },

  /**
   * @private
   * @desc オプションの初期化 第1段階
   * @param {string|Object} source - サーバサイド言語へのパス、またはデータそのものの連想配列
   * @param {Object} option - 連想配列の形式のオプション
   * @return {Object} - 第1段階が終了したオプション
   */
  _setOption1st: function(source, option) {
    return $.extend({
      // 基本設定
      source: source,
      lang: 'ja',
      plugin_type: 'combobox',
      init_record: false,
      db_table: 'tbl',
      field: 'name',
      and_or: 'AND',
      per_page: 10,
      navi_num: 5,
      primary_key: 'id',
      button_img: 'dist/btn.png',
      bind_to: false,
      navi_simple: false,

      // サブ情報
      sub_info: false,
      sub_as: {},
      show_field: '',
      hide_field: '',

      // セレクト専用
      select_only: false,

      // タグ検索
      tags: false,

      // URL短縮用
      shorten_btn: false, // 短縮実行ボタンのセレクタ
      shorten_src: 'dist/bitly.php',
      shorten_min: 20,
      shorten_reg: false
    }, option);
  },

  /**
   * @private
   * @desc オプションの初期化 第2段階
   * @param {Object} option - 連想配列の形式のオプション
   * @return {Object} - 第2段階が終了したオプション
   */
  _setOption2nd: function(option) {
    // 検索するフィールド(カンマ区切りで複数指定可能)
    option.search_field = (option.search_field === undefined) ?
      option.field :
      option.search_field;

    // 大文字で統一
    option.and_or = option.and_or.toUpperCase();

    // カンマ区切りのオプションを配列に変換する。
    var arr = ['hide_field', 'show_field', 'search_field'];
    for (var i=0; i<arr.length; i++) {
      option[arr[i]] = this._strToArray(option[arr[i]]);
    }

    // CASE WHEN後のORDER BY指定
    option.order_by = (option.order_by === undefined) ?
      option.search_field :
      option.order_by;

    // order_by を多層配列に
    // 例:  [ ['id', 'ASC'], ['name', 'DESC'] ]
    option.order_by = this._setOrderbyOption(option.order_by, option.field);

    // テキストエリア
    if (option.plugin_type == 'textarea') {
      option.shorten_reg = this._setRegExpShort(option.shorten_reg, option.shorten_min);
    }

    // カテゴリタグ
    if (option.tags) {
      option.tags = this._setTagPattern(option);
    }
    return option;
  },

  /**
   * @private
   * @desc カンマ区切りの文字列を配列にする。
   * @param {string} str - 文字列
   * @return {Array} - 配列
   */
  _strToArray: function(str) {
    return str.replace(/[\s　]+/g, '').split(',');
  },

  /**
   * @private
   * @desc URL短縮用に、URLらしき文字列を検索するための正規表現を生成する
   * @param {Object|boolean} shorten_reg - ユーザが指定した正規表現オブジェクト、もしくはfalse
   * @return {Object} - 正規表現オブジェクト
   */
  _setRegExpShort: function(shorten_reg, shorten_min) {
    if (shorten_reg) return shorten_reg; // ユーザが正規表現を設定しているなら、それを使う。
    var reg = '(?:^|[\\s|　\\[(<「『（【［＜〈《]+)';
    reg += '(';
    reg += 'https:\\/\\/[^\\s|　\\])>」』）】］＞〉》]{' + (shorten_min - 7) + ',}';
    reg += '|';
    reg += 'http:\\/\\/[^\\s|　\\])>」』）】］＞〉》]{'  + (shorten_min - 6) + ',}';
    reg += '|';
    reg += 'ftp:\\/\\/[^\\s|　\\])>」』）】］＞〉》]{'   + (shorten_min - 5) + ',}';
    reg += ')';
    return new RegExp(reg, 'g');
  },

  /**
   * @private
   * @desc テカテゴリタグの定義方法を設定する
   * @param {Object} option - オプション全体の連想配列
   * @return {Object} - タグ定義を格納した連想配列
   */
  _setTagPattern: function(option) {
    for (var i = 0; i < option.tags.length; i++) {
      option.tags[i] = this._setTagOptions(option, i);
      option.tags[i].pattern = this._setRegExpTag(option.tags[i].pattern, option.tags[i].space);
    }
    return option.tags;
  },

  /**
   * @private
   * @desc 各タグの検索方法を設定する
   * @param {Object} option - オプション全体の連想配列
   * @param {number} idx - 選択中のタグを表す添字
   * @return {Object} - タグ1つ分のオプションの連想配列
   */
  _setTagOptions: function(option, idx) {
    option.tags[idx] = $.extend({
      // スペース挿入
      space: [true, true],
      
      // DB接続
      db_table: option.db_table,
      field: option.field,
      search_field: option.search_field,
      primary_key: option.primary_key,

      // サブ情報
      sub_info: option.sub_info,
      sub_as: option.sub_as,
      show_field: option.show_field,
      hide_field: option.hide_field
    }, option.tags[idx]);

    // カンマ区切りのオプションを配列に変換する。
    var arr = ['hide_field', 'show_field', 'search_field'];
    for (var i = 0; i < arr.length; i++) {
      if (typeof option.tags[idx][arr[i]] != 'object') {
        option.tags[idx][arr[i]] = this._strToArray(option.tags[idx][arr[i]]);
      }
    }

    // order_byを配列にする
    option.tags[idx].order_by = (option.tags[idx].order_by === undefined) ?
      option.order_by :
      this._setOrderbyOption(option.tags[idx].order_by, option.tags[idx].field);

    return option.tags[idx];
  },

  /**
   * @private
   * @desc 各タグを抽出するための一連の正規表現を作成する
   * @param {Array} pattern - タグの開始と終了のペアを表す配列
   * @param {Array} space - タグとタグの間の空白を表す配列
   * @return {Object} - タグのパターンを表す連想配列
   */
  _setRegExpTag: function(pattern, space) {
    // ユーザオプションを正規表現エスケープ
    var esc_left  = pattern[0].replace(/[\s\S]*/, this._escapeForReg);
    var esc_right = pattern[1].replace(/[\s\S]*/, this._escapeForReg);

    return {
      // 素のカッコ文字
      left: pattern[0],
      right: pattern[1],

      // キャレットの左側へ、開始カッコまでを抜き出す正規表現
      reg_left: new RegExp(esc_left + '((?:(?!' + esc_left + '|' + esc_right + ')[^\\s　])*)$'),

      // キャレットの右側へ、終了カッコまでを抜き出す正規表現
      reg_right: new RegExp('^((?:(?!' + esc_left + '|' + esc_right + ')[^\\s　])+)'),

      // 候補選択後、開始カッコ前にスペースを挿入するかを判断するための正規表現
      // これに当てはまらない場合、スペースを挿入する。
      space_left: new RegExp('^' + esc_left + '$|[\\s　]+' + esc_left + '$'),

      // 候補選択後、終了カッコ前にスペースを挿入するかを判断するための正規表現
      // これに当てはまらない場合、スペースを挿入する。
      space_right: new RegExp('^$|^[\\s　]+'),

      // 候補選択後、終了カッコを補完するかを判断するための正規表現
      comp_right: new RegExp('^' + esc_right)
    };
  },

  /**
   * @private
   * @desc 正規表現用エスケープ用の無名関数
   * @param {string} text - マッチした部分文字列
   * @return {string} - 置換する値
   */
  _escapeForReg: function(text) {
    return '\\u' + (0x10000 + text.charCodeAt(0)).toString(16).slice(1);
  },

  /**
   * @private
   * @desc コンボボックスとタグ、両方の order_by を配列にする
   * @param {Array} arg_order - ORDER BY の情報を格納した配列
   * @param {string} arg_field - 検索対象のフィールド
   * @return {Array} - order_by の配列
   */
  _setOrderbyOption: function(arg_order, arg_field) {
    var arr = [];
    var orders = [];
    if (typeof arg_order == 'object') {
      for (var i = 0; i < arg_order.length; i++) {
        orders = $.trim(arg_order[i]).split(' ');
        arr[i] =  (orders.length == 2) ? orders : [orders[0], 'ASC'];
      }
    } else {
      orders = $.trim(arg_order).split(' ');
      arr[0] = (orders.length == 2) ?
        orders :
        (orders[0].match(/^(ASC|DESC)$/i)) ?
          [arg_field, orders[0]] :
          [orders[0], 'ASC'];
    }
    return arr;
  },

  /**
   * @private
   * @desc プラグインの中で使うメッセージを設定する
   */
  _setMessage: function() {
    var message;
    switch (this.option.lang) {
      // German (Thanks Sebastian Gohres)
      case 'de':
        message = {
          add_btn     : 'Hinzufügen-Button',
          add_title   : 'Box hinzufügen',
          del_btn     : 'Löschen-Button',
          del_title   : 'Box löschen',
          next        : 'Nächsten',
          next_title  : 'Nächsten' + this.option.per_page + ' (Pfeil-rechts)',
          prev        : 'Vorherigen',
          prev_title  : 'Vorherigen' + this.option.per_page + ' (Pfeil-links)',
          first_title : 'Ersten (Umschalt + Pfeil-links)',
          last_title  : 'Letzten (Umschalt + Pfeil-rechts)',
          get_all_btn : 'alle (Pfeil-runter)',
          get_all_alt : '(Button)',
          close_btn   : 'Schließen (Tab)',
          close_alt   : '(Button)',
          loading     : 'lade...',
          loading_alt : '(lade)',
          page_info   : 'num_page_top - num_page_end von cnt_whole',
          select_ng   : 'Achtung: Bitte wählen Sie aus der Liste aus.',
          select_ok   : 'OK : Richtig ausgewählt.',
          not_found   : 'nicht gefunden',
          ajax_error  : 'Bei der Verbindung zum Server ist ein Fehler aufgetreten. (ajax-combobox)'
        };
        break;

      // English
      case 'en':
        message = {
          add_btn     : 'Add button',
          add_title   : 'add a box',
          del_btn     : 'Del button',
          del_title   : 'delete a box',
          next        : 'Next',
          next_title  : 'Next' + this.option.per_page + ' (Right key)',
          prev        : 'Prev',
          prev_title  : 'Prev' + this.option.per_page + ' (Left key)',
          first_title : 'First (Shift + Left key)',
          last_title  : 'Last (Shift + Right key)',
          get_all_btn : 'Get All (Down key)',
          get_all_alt : '(button)',
          close_btn   : 'Close (Tab key)',
          close_alt   : '(button)',
          loading     : 'loading...',
          loading_alt : '(loading)',
          page_info   : 'num_page_top - num_page_end of cnt_whole',
          select_ng   : 'Attention : Please choose from among the list.',
          select_ok   : 'OK : Correctly selected.',
          not_found   : 'not found',
          ajax_error  : 'An error occurred while connecting to server. (ajax-combobox)'
        };
        break;

      // Spanish (Thanks Joaquin G. de la Zerda)
      case 'es':
        message = {
          add_btn     : 'Agregar boton',
          add_title   : 'Agregar una opcion',
          del_btn     : 'Borrar boton',
          del_title   : 'Borrar una opcion',
          next        : 'Siguiente',
          next_title  : 'Proximas ' + this.option.per_page + ' (tecla derecha)',
          prev        : 'Anterior',
          prev_title  : 'Anteriores ' + this.option.per_page + ' (tecla izquierda)',
          first_title : 'Primera (Shift + Left)',
          last_title  : 'Ultima (Shift + Right)',
          get_all_btn : 'Ver todos (tecla abajo)',
          get_all_alt : '(boton)',
          close_btn   : 'Cerrar (tecla TAB)',
          close_alt   : '(boton)',
          loading     : 'Cargando...',
          loading_alt : '(Cargando)',
          page_info   : 'num_page_top - num_page_end de cnt_whole',
          select_ng   : 'Atencion: Elija una opcion de la lista.',
          select_ok   : 'OK: Correctamente seleccionado.',
          not_found   : 'no encuentre',
          ajax_error  : 'Un error ocurrió mientras conectando al servidor. (ajax-combobox)'
        };
        break;

      // Brazilian Portuguese (Thanks Marcio de Souza)
      case 'pt-br':
        message = {
          add_btn     : 'Adicionar botão',
          add_title   : 'Adicionar uma caixa',
          del_btn     : 'Apagar botão',
          del_title   : 'Apagar uma caixa',
          next        : 'Próxima',
          next_title  : 'Próxima ' + this.option.per_page + ' (tecla direita)',
          prev        : 'Anterior',
          prev_title  : 'Anterior ' + this.option.per_page + ' (tecla esquerda)',
          first_title : 'Primeira (Shift + Left)',
          last_title  : 'Última (Shift + Right)',
          get_all_btn : 'Ver todos (Seta para baixo)',
          get_all_alt : '(botão)',
          close_btn   : 'Fechar (tecla TAB)',
          close_alt   : '(botão)',
          loading     : 'Carregando...',
          loading_alt : '(Carregando)',
          page_info   : 'num_page_top - num_page_end de cnt_whole',
          select_ng   : 'Atenção: Escolha uma opção da lista.',
          select_ok   : 'OK: Selecionado Corretamente.',
          not_found   : 'não encontrado',
          ajax_error  : 'Um erro aconteceu enquanto conectando a servidor. (ajax-combobox)'
        };
        break;

      // Japanese (ja)
      default:
        message = {
          add_btn     : '追加ボタン',
          add_title   : '入力ボックスを追加します',
          del_btn     : '削除ボタン',
          del_title   : '入力ボックスを削除します',
          next        : '次へ',
          next_title  : '次の' + this.option.per_page + '件 (右キー)',
          prev        : '前へ',
          prev_title  : '前の' + this.option.per_page + '件 (左キー)',
          first_title : '最初のページへ (Shift + 左キー)',
          last_title  : '最後のページへ (Shift + 右キー)',
          get_all_btn : '全件取得 (下キー)',
          get_all_alt : '画像:ボタン',
          close_btn   : '閉じる (Tabキー)',
          close_alt   : '画像:ボタン',
          loading     : '読み込み中...',
          loading_alt : '画像:読み込み中...',
          page_info   : 'num_page_top - num_page_end 件 (全 cnt_whole 件)',
          select_ng   : '注意 : リストの中から選択してください',
          select_ok   : 'OK : 正しく選択されました。',
          not_found   : '(0 件)',
          ajax_error  : 'サーバとの通信でエラーが発生しました。(ajax-combobox)'
        };
    }
    this.message = message;
  },

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
  },

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
      elem.img    = $('<img>').attr('src', this.option.button_img);
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
      $(this.elem.img).attr('src', this.option.button_img);
    }
  },

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
        error: function(jqXHR, textStatus, errorThrown) { self._ajaxErrorNotify(self, errorThrown); }
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
  },

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
  },

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
      error: function(jqXHR, textStatus, errorThrown) { self._ajaxErrorNotify(self, errorThrown); },
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
  },


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
  },

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
  },

  /**
   * @private
   * @desc キー入力への対応
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   * @param {Object} e - jQueryのイベントオブジェクト
   */
  _processKey: function(self, e) {
    if (
      ($.inArray(e.keyCode, [27,38,40,9]) > -1 && $(self.elem.result_area).is(':visible')) ||
      ($.inArray(e.keyCode, [37,39,13,9]) > -1 && self._getCurrentLine(self)) ||
      (e.keyCode == 40 && self.option.plugin_type != 'textarea')
    ) {
      e.preventDefault();
      e.stopPropagation();
      e.cancelBubble = true;
      e.returnValue  = false;

      switch (e.keyCode) {
        case 37: // left
          if (e.shiftKey) self._firstPage(self);
          else            self._prevPage(self);
          break;

        case 38: // up
          self.prop.key_select = true;
          self._prevLine(self);
          break;

        case 39: // right
          if (e.shiftKey) self._lastPage(self);
          else            self._nextPage(self);
          break;

        case 40: // down
          if ($(self.elem.results).children('li').length) {
            self.prop.key_select = true;
            self._nextLine(self);
          } else {
            self.prop.is_suggest = false;
            self._suggest(self);
          }
          break;

        case 9: // tab
          self.prop.key_paging = true;
          self._hideResults(self);
          break;

        case 13: // return
          self._selectCurrentLine(self, true);
          break;

        case 27: //  escape
          self.prop.key_paging = true;
          self._hideResults(self);
          break;
      }
    } else {
      if (e.keyCode != 16) self._setCssFocusedInput(self); // except Shift(16)
      self._checkValue(self);
    }
  },

  /**
   * @private
   * @desc Ajax通信を中断する
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _abortAjax: function(self) {
    if (self.prop.xhr) {
      self.prop.xhr.abort();
      self.prop.xhr = false;
    }
  },

  /**
   * @private
   * @desc データベースもしくは連想配列から検索する
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _suggest: function(self) {
    // コンボボックスの種類によって検索文字列の形式を変える
    var q_word;
    if (self.option.plugin_type != 'textarea') {
      q_word = (self.prop.is_suggest) ? $.trim($(self.elem.combo_input).val()) : '';
      if (q_word.length < 1 && self.prop.is_suggest) {
        self._hideResults(self);
        return;
      }
      q_word = q_word.split(/[\s　]+/);
    } else {
      q_word = [self.prop.tag.str];
    }

    self._abortAjax(self);
    self._setLoading(self);
    $(self.elem.sub_info).children('dl').hide(); // サブ情報消去

    // ここで、本来は真偽値が格納される変数に数値を格納している。
    if (self.prop.is_paging) {
      var obj = self._getCurrentLine(self);
      self.prop.is_paging = (obj) ? $(self.elem.results).children('li').index(obj) : -1;
    } else if (!self.prop.is_suggest) {
      self.prop.is_paging = 0;
    }
    var which_page_num = (self.prop.is_suggest) ? self.prop.page_suggest : self.prop.page_all;

    // データ取得
    if (typeof self.option.source == 'object') self._searchForJson(self, q_word, which_page_num);
    else                                       self._searchForDb(self, q_word, which_page_num);
  },

  /**
   * @private
   * @desc ローディング画像を表示する
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _setLoading: function(self) {
    $(self.elem.navi_info).text(self.message.loading);
    if ($(self.elem.results).html() === '') {
      $(self.elem.navi).children('p').empty();
      self._calcWidthResults(self);
      $(self.elem.container).addClass(self.css_class.container_open);
    }
  },

  /**
   * @private
   * @desc データベースに対して検索する
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   * @param {Array} q_word - 検索文字列を収めた配列
   * @param {number} which_page_num - ページ番号
   */
  _searchForDb: function(self, q_word, which_page_num) {
    self.prop.xhr = $.ajax({
      dataType: 'json',
      url: self.option.source,
      data: {
        q_word: q_word,
        page_num: which_page_num,
        per_page: self.option.per_page,
        search_field: self.option.search_field,
        and_or: self.option.and_or,
        order_by: self.option.order_by,
        db_table: self.option.db_table
      },
      success: function(json) {
        json.candidate   = [];
        json.primary_key = [];
        json.subinfo     = [];
        if (typeof json.result != 'object') {
          // 検索結果はゼロだった。
          self.prop.xhr = null;
          self._notFoundSearch(self);
          return;
        }
        json.cnt_page = json.result.length;
        for (i = 0; i < json.cnt_page; i++) {
          json.subinfo[i] = [];
          for (var key in json.result[i]) {
            if (key == self.option.primary_key) {
              json.primary_key.push(json.result[i][key]);
            }
            if (key == self.option.field) {
              json.candidate.push(json.result[i][key]);
            } else if ($.inArray(key, self.option.hide_field) == -1) {
              if (
                self.option.show_field !== '' &&
                $.inArray('*', self.option.show_field) == -1 &&
                $.inArray(key, self.option.show_field) == -1
              ) {
                continue;
              } else {
                json.subinfo[i][key] = json.result[i][key];
              }
            }
          }
        }
        delete(json.result);
        self._prepareResults(self, json, q_word, which_page_num);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        // このAjax通信のみ、プラグインが故意に通信を中断する場合がある。
        // その場合は警告を表示させない。
        if (textStatus != 'abort') {
          self._hideResults(self);
          self._ajaxErrorNotify(self, errorThrown);
        }
      },
      complete: function() { self.prop.xhr = null; }
    });
  },

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
    for (i = 0; i < self.option.source.length; i++) {
      var flag = false;
      for (var j=0; j<arr_reg.length; j++) {
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
    for (i = 0; i < matched.length; i++) {
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
    for (i = start, sub = 0; i < end; i++, sub++) {
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
  },

  /**
   * @private
   * @desc 独自のソート (昇順)
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   * @param {Array} arr - 検索結果の配列
   */
  _sortAsc: function(self, arr) {
    arr.sort(function(a, b) {
      return a[self.option.order_by[0][0]].localeCompare(b[self.option.order_by[0][0]]);
    });
    return arr;
  },

  /**
   * @private
   * @desc 独自のソート (降順)
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   * @param {Array} arr - 検索結果の配列
   */
  _sortDesc: function(self, arr) {
    arr.sort(function(a, b) {
      return b[self.option.order_by[0][0]].localeCompare(a[self.option.order_by[0][0]]);
    });
    return arr;
  },

  /**
   * @private
   * @desc 問い合わせ該当件数ゼロだった場合の処理
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _notFoundSearch: function(self) {
    $(self.elem.navi_info).text(self.message.not_found);
    $(self.elem.navi_p).hide();
    $(self.elem.results).empty();
    $(self.elem.sub_info).empty();
    self._calcWidthResults(self);
    $(self.elem.container).addClass(self.css_class.container_open);
    self._setCssFocusedInput(self);
  },

  /**
   * @private
   * @desc 検索結果の表示を準備する
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   * @param {Object} json - サーバからのレスポンス
   * @param {Array} q_word - 検索文字列を収めた配列
   * @param {number} which_page_num - ページ番号
   */
  _prepareResults: function(self, json, q_word, which_page_num) {
    // 1ページのみでもナビを表示する
    self._setNavi(self, json.cnt_whole, json.cnt_page, which_page_num);

    if (!json.subinfo || !self.option.sub_info) json.subinfo = false;
    if (!json.primary_key) json.primary_key = false;

    // セレクト専用時
    // 本来なら、候補リストから選ばなければならないが、
    // 候補の数が一つで、その候補の文字列と入力文字列が一致する場合、
    // 『リストから選ばれた』と判断する。
    if (
      self.option.select_only &&
      json.candidate.length === 1 &&
      json.candidate[0] == q_word[0]
    ) {
      if (self.option.plugin_type != 'textarea') $(self.elem.hidden).val(json.primary_key[0]);
      this._setButtonAttrDefault();
    }
    // 候補リストを表示する
    self._displayResults(self, json.candidate, json.subinfo, json.primary_key);
    if (self.prop.is_paging === false) {
      self._setCssFocusedInput(self);
    } else {
      // 全件表示とページ移動時、直前の行番号と同じ候補を選択状態にする
      var idx = self.prop.is_paging; // 真偽値を収めるべき変数に、例外的に数値が入っている。
      var limit = $(self.elem.results).children('li').length - 1;
      if (idx > limit) idx = limit;
      var obj = $(self.elem.results).children('li').eq(idx);
      $(obj).addClass(self.css_class.select);
      self._setSubInfo(self, obj);
      self.prop.is_paging = false; // 次回に備えて初期化する

      self._setCssFocusedResults(self);
    }
  },

  /**
   * @private
   * @desc ナビ部分を作成する
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   * @param {number} cnt_whole - ヒットした件数
   * @param {number} cnt_page - このページで表示する候補の件数
   * @param {number} page_num - 現在ページの番号
   */
  _setNavi: function(self, cnt_whole, cnt_page, page_num) {
    var num_page_top = self.option.per_page * (page_num - 1) + 1;
    var num_page_end = num_page_top + cnt_page - 1;
    var cnt_result = self.message.page_info
      .replace('cnt_whole'    , cnt_whole)
      .replace('num_page_top' , num_page_top)
      .replace('num_page_end' , num_page_end);
    $(self.elem.navi_info).text(cnt_result);

    // ページング部分
    var last_page = Math.ceil(cnt_whole / self.option.per_page); // 全ページ数
    if (last_page > 1) {
      $(self.elem.navi_p).empty();
      // ページ数
      if (self.prop.is_suggest) {
        self.prop.max_suggest = last_page;
      } else {
        self.prop.max_all = last_page;
      }
      // 表示する一連のページ番号の左右端
      var left  = page_num - Math.ceil ((self.option.navi_num - 1) / 2);
      var right = page_num + Math.floor((self.option.navi_num - 1) / 2);
      // 現ページが端近くの場合のleft,rightの調整
      while (left < 1) {
        left ++;
        right++;
      }
      while (right > last_page) right--;
      while ((right-left < self.option.navi_num - 1) && left > 1) left--;

      // 『<< 前へ』の表示
      if (page_num == 1) {
        if (!self.option.navi_simple) {
          $('<span>')
            .text('<< 1')
            .addClass('page_end')
            .appendTo(self.elem.navi_p);
        }
        $('<span>')
          .text(self.message.prev)
          .addClass('page_end')
          .appendTo(self.elem.navi_p);
      } else {
        if (!self.option.navi_simple) {
          $('<a>')
            .attr({
              'href': '#',
              'class': 'navi_first'
            })
            .text('<< 1')
            .attr('title', self.message.first_title)
            .appendTo(self.elem.navi_p);
        }
        $('<a>')
          .attr({
            'href': '#',
            'class': 'navi_prev',
            'title': self.message.prev_title
          })
          .text(self.message.prev)
          .appendTo(self.elem.navi_p);
      }
      // 各ページへのリンクの表示
      for (var i = left; i <= right; i++) {
        // 現在のページ番号は<span>で囲む(強調表示用)
        var num_link = (i == page_num) ? '<span class="current">' + i + '</span>' : i;
        $('<a>')
          .attr({
            'href': '#',
            'class': 'navi_page'
          })
          .html(num_link)
          .appendTo(self.elem.navi_p);
      }
      // 『次のX件 >>』の表示
      if (page_num == last_page) {
        $('<span>')
          .text(self.message.next)
          .addClass('page_end')
          .appendTo(self.elem.navi_p);
        if (!self.option.navi_simple) {
          $('<span>')
            .text(last_page + ' >>')
            .addClass('page_end')
            .appendTo(self.elem.navi_p);
        }
      } else {
        $('<a>')
          .attr({
            'href': '#',
            'class': 'navi_next'
          })
          .text(self.message.next)
          .attr('title', self.message.next_title)
          .appendTo(self.elem.navi_p);
        if (!self.option.navi_simple) {
          $('<a>')
            .attr({
              'href': '#',
              'class': 'navi_last'
            })
            .text(last_page + ' >>')
            .attr('title', self.message.last_title)
            .appendTo(self.elem.navi_p);
        }
      }
      $(self.elem.navi_p).show();
      self._ehNaviPaging(self); // イベントハンドラ設定
    } else {
      $(self.elem.navi_p).hide();
    }
  },

  /**
   * @private
   * @desc サブ情報を表示する
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   * @param {Object} obj - サブ情報を右隣に表示させる<li>要素
   */
  _setSubInfo: function(self, obj) {
    // サブ情報を表示しない設定なら、ここで終了
    if (!self.option.sub_info) return; 

    // サブ情報の座標設定用の基本情報
    self.prop.size_results = ($(self.elem.results).outerHeight() - $(self.elem.results).height()) / 2;
    self.prop.size_navi    = $(self.elem.navi).outerHeight();
    self.prop.size_li      = $(self.elem.results).children('li:first').outerHeight();
    self.prop.size_left    = $(self.elem.results).outerWidth();

    // 現在の<li>の番号は？
    var idx = $(self.elem.results).children('li').index(obj);

    // 一旦、サブ情報全非表示 (<dl>単位で非表示にする)
    $(self.elem.sub_info).children('dl').hide();

    // 位置調整
    var t_top = 0;
    if ($(self.elem.navi).css('display') != 'none') t_top += self.prop.size_navi;
    t_top += (self.prop.size_results + self.prop.size_li * idx);
    var t_left = self.prop.size_left;
    t_top  += 'px';
    t_left += 'px';

    $(self.elem.sub_info).children('dl').eq(idx).css({
      position: 'absolute',
      top: t_top,
      left: t_left,
      display: 'block'
    });
  },

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

          // thの別名を検索する
          if (self.option.sub_as[key] !== null) dt = self.option.sub_as[key];
          else dt = key;

          dt = $('<dt>').text(dt); // XSS対策
          if (self.option.sub_info == 'simple') $(dt).addClass('hide');
          $dl.append(dt);

          dd = $('<dd>').text(arr_subinfo[i][key]); // !!! against XSS !!!
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
  },

  /**
   * @private
   * @desc 1ページ目を表示する
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _firstPage: function(self) {
    if (!self.prop.is_suggest) {
      if (self.prop.page_all > 1) {
        self.prop.page_all = 1;
        self.prop.is_paging = true;
        self._suggest(self);
      }
    } else {
      if (self.prop.page_suggest > 1) {
        self.prop.page_suggest = 1;
        self.prop.is_paging = true;
        self._suggest(self);
      }
    }
  },

  /**
   * @private
   * @desc 前のページを表示する
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _prevPage: function(self) {
    if (!self.prop.is_suggest) {
      if (self.prop.page_all > 1) {
        self.prop.page_all--;
        self.prop.is_paging = true;
        self._suggest(self);
      }
    } else {
      if (self.prop.page_suggest > 1) {
        self.prop.page_suggest--;
        self.prop.is_paging = true;
        self._suggest(self);
      }
    }
  },

  /**
   * @private
   * @desc 次のページを表示する
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _nextPage: function(self) {
    if (self.prop.is_suggest) {
      if (self.prop.page_suggest < self.prop.max_suggest) {
        self.prop.page_suggest++;
        self.prop.is_paging = true;
        self._suggest(self);
      }
    } else {
      if (self.prop.page_all < self.prop.max_all) {
        self.prop.page_all++;
        self.prop.is_paging = true;
        self._suggest(self);
      }
    }
  },

  /**
   * @private
   * @desc 最後のページを表示する
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _lastPage: function(self) {
    if (!self.prop.is_suggest) {
      if (self.prop.page_all < self.prop.max_all) {
        self.prop.page_all = self.prop.max_all;
        self.prop.is_paging = true;
        self._suggest(self);
      }
    } else {
      if (self.prop.page_suggest < self.prop.max_suggest) {
        self.prop.page_suggest = self.prop.max_suggest;
        self.prop.is_paging = true;
        self._suggest(self);
      }
    }
  },

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
  },

  /**
   * @private
   * @desc 選択候補を次に移す
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _nextLine: function(self) {
    var obj = self._getCurrentLine(self);
    var idx;
    if (!obj) {
      idx = -1;
    } else {
      idx = $(self.elem.results).children('li').index(obj);
      $(obj).removeClass(self.css_class.select);
    }
    idx++;
    if (idx < $(self.elem.results).children('li').length) {
      var next = $(self.elem.results).children('li').eq(idx);
      self._setSubInfo(self, next);
      $(next).addClass(self.css_class.select);
      self._setCssFocusedResults(self);
    } else {
      self._setCssFocusedInput(self);
    }
    // 選択候補を追いかけてスクロール
    self._scrollWindow(self, false);
  },

  /**
   * @private
   * @desc 選択候補を前に移す
   * @param {Object} self - このクラスのインスタンスオブジェクトへの参照
   */
  _prevLine: function(self) {
    var obj = self._getCurrentLine(self);
    var idx;
    if (!obj) {
      idx = $(self.elem.results).children('li').length;
    } else {
      idx = $(self.elem.results).children('li').index(obj);
      $(obj).removeClass(self.css_class.select);
    }
    idx--;
    if (idx > -1) {
      var prev = $(self.elem.results).children('li').eq(idx);
      self._setSubInfo(self, prev);
      $(prev).addClass(self.css_class.select);
      self._setCssFocusedResults(self);
    } else {
      self._setCssFocusedInput(self);
    }
    // 選択候補を追いかけてスクロール
    self._scrollWindow(self, false);
  }
}); // END OF "$.extend(AjaxComboBox.prototype,"

})( /** namespace */ jQuery);