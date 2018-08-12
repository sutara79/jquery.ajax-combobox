/**
 * @function external:"jQuery.fn".ajaxComboBox
 * @param {string|Object} source - サーバ側のプログラム、もしくは連想配列そのもの。
 * @param {Object} option - オプションを収めた連想配列。
 * @param {boolean} [option.instance] - プラグインを呼び出すとき、jQueryオブジェクトではなくインスタンスを返すかどうか
 * @param {string} [option.lang='en'] - Language used in this plugin's UI. ('en', 'es', 'pt-br' and 'ja')
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
 * @param {Object} [option.sub_as={}] - サブ情報のフィールドの別名。連想配列で指定する。
 * @param {string} [option.show_field] - サブ情報で表示するフィールド。カンマ区切りで複数指定可能。 (e.g.: 'id' or 'id, job, age')
 * @param {string} [option.hide_field] - サブ情報で非表示にするフィールド。カンマ区切りで複数指定可能。 (e.g.: 'id' or 'id, job, age')
 * @param {boolean} [option.select_only=false] - セレクト専用にする。(データベースに登録された値しか受け入れない)
 * @param {string} [option.primary_key='id'] - セレクト専用時、Form の hidden の値に指定される、レコードを特定できるフィールド。
 * @param {string} [option.button_img='<svg class="octicon octicon-chevron-down" viewBox="0 0 10 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M5 11L0 6l1.5-1.5L5 8.25 8.5 4.5 10 6z"></path></svg>'] - ボタンに使われる画像
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
/*global $*/
export default function (source, option) {
  var arr = [];
  this.each(function() {
    arr.push(new $.ajaxComboBox(this, source, option));
  });
  return (option !== undefined && option.instance !== undefined && option.instance) ? $(arr) : this;
}
