$.extend($.ajaxComboBox.prototype, /** @lends external:jQuery.ajaxComboBox.prototype */ {
  /**
   * Initialize options
   * @private
   * @arg {string|object} source - Server side file such as PHP. Or, JS object which contains data.
   * @arg {object} option - Options sent by user.
   * @returns {object} Initialized options 
   */
  _setOption: function(source, option) {
    option = this._setOption1st(source, option);
    option = this._setOption2nd(option);
    return option;
  },

  /**
   * @private
   * @desc オプションの初期化 第1段階
   * @arg {string|object} source - サーバサイド言語へのパス、またはデータそのものの連想配列
   * @arg {object} option - 連想配列の形式のオプション
   * @return {object} - 第1段階が終了したオプション
   */
  _setOption1st: function(source, option) {
    return $.extend({
      // 基本設定
      source: source,
      lang: 'en',
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
   * @arg {object} option - 連想配列の形式のオプション
   * @return {object} - 第2段階が終了したオプション
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

    // Show rest fields as sub info
    if (option.show_field[0] === '') {
      option.show_field[0] = '*'
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
   * @arg {string} str - 文字列
   * @return {Array} - 配列
   */
  _strToArray: function(str) {
    return str.replace(/[\s　]+/g, '').split(',');
  },

  /**
   * @private
   * @desc URL短縮用に、URLらしき文字列を検索するための正規表現を生成する
   * @arg {object|boolean} shorten_reg - ユーザが指定した正規表現オブジェクト、もしくはfalse
   * @return {object} - 正規表現オブジェクト
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
   * @arg {object} option - オプション全体の連想配列
   * @return {object} - タグ定義を格納した連想配列
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
   * @arg {object} option - オプション全体の連想配列
   * @arg {number} idx - 選択中のタグを表す添字
   * @return {object} - タグ1つ分のオプションの連想配列
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
   * @arg {Array} pattern - タグの開始と終了のペアを表す配列
   * @arg {Array} space - タグとタグの間の空白を表す配列
   * @return {object} - タグのパターンを表す連想配列
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
   * @arg {string} text - マッチした部分文字列
   * @return {string} - 置換する値
   */
  _escapeForReg: function(text) {
    return '\\u' + (0x10000 + text.charCodeAt(0)).toString(16).slice(1);
  },

  /**
   * @private
   * @desc コンボボックスとタグ、両方の order_by を配列にする
   * @arg {Array} arg_order - ORDER BY の情報を格納した配列
   * @arg {string} arg_field - 検索対象のフィールド
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
