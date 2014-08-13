# Change Log for jquery.ajax-combobox

### 7.3.0-alpha (2014-08-13)
- Brazilian Portuguese was added to the language of the message. Thanks Marcio de Souza!  
  (プラグインのメッセージの言語にブラジル系ポルトガル語を選べるようになりました。マルシオ・ソウザさんに感謝します。)
- CAUTION: Shortening URL can not work. (v7.2.1 is also)  
  I am investigating it now.
  (現在、URL短縮が機能しておらず、調査中です。)

### 7.2.1 (2014-08-08)
- Plugin name was changed.  
  (プラグイン名、ファイル名、フォルダ名を変更しました。)

### v7.2 (2014-07-05)
- Code-refactoring has done.  
  (ソースコードの内容をオブジェクト指向で書きなおしました。)
- JSDoc was made.  
  (ソースコードを理解しやすくするために、JSDocを作成しました。)
- "shorten_url" option is renamed "shorten_btn".  
  ("shorten_url"オプションを"shorten_btn"に名称変更しました。)


### v7.1 (2013-08-09)
- bug fix for IE7 SCRIPT1028 error.  
  (IE7でエラーが起きるバグを修正しました。)


### v7.0 (2013-07-25)
- The method of the connection with the database is changed to PDO.  
  (DBへの接続の方式をPDOに変更しました。)


### v6.3 (2012-11-11)
- It was modified for adapting to Opera12 but not Opera11.  
  (Opera12用に処理を変更しました。引き換えに、Opera11では正しく動作しません。)


### v6.2 (2012-11-02)
- The error about searching when you used the under bar for a field name of the database was corrected.  
  (データベースのフィールド名にアンダーバー"_"が使われていると、検索が正常に行われない不具合を修正しました。)


### v6.1 (2012-09-08)
- Searching for tags on "Opera" browser became able to work correctly.  
  (Operaブラウザでも、タグ検索が正常に動作するようになりました。)


### v6.0 (2012-09-06)
- You can newly choose "textarea" in "plugin_type" options.  
  ("plugin_type"オプションに"textarea"を追加しました。)
	- "textarea" cannot use "select_only" options.  
	  ("textarea"では、セレクト専用のオプションは使えません。)
	- "textarea" cannot record "sub_info" after selecting.  
	  ("textarea"では、候補を選択後、サブ情報を記憶させることができません。)


### v5.9 (2012-09-02)
- "order_field" option was abolished.  
  ("order_field"オプションを廃止しました。)
- The means of "order_by" option was changed.   
  [Detail](http://www.usamimi.info/~sutara/ajaxComboBox/#sample01_06)
  ("order_by"オプションの仕様が変更されました。)


### v5.8 (2012-08-24)
- The PHP file was corrected so that "\_"(underbar) and "%"(percent) could be proccessed correctly on SQLite3.   
  (SQLite3の検索において、検索文字列の中の"\_"(アンダーバー)や"%"(パーセント)を正しく扱うように、PHPファイルを変更しました。


### v5.7 (2012-08-09)
- The error that "Result-list" is not displayed on the right position when the CSS value of "position" of ".ac_container" is not "static" is corrected.   
  (".ac_container"のCSSが"position:static"以外だと、候補リストが正常な位置に表示されない不具合を修正しました。"position"の値に関わらず、正常に表示されます。)


### v5.6 (2012-07-16)
- The database used in this plug-in was changed into SQLite3 from SQLite2.  
  (使用するデータベースをSQLite2からSQLite3へ変更しました。)
- You can search "%" and "_" from database.  
  ("%"や"_"を検索できない不具合を修正しました。)


### v5.5 (2012-07-13)
- The width of sub-info when "sub_info:simple", was corrected.  
  (sub_info:simpleの場合の、サブ情報の幅の乱れを修正しました。)
- "word-wrap : break-word" was added to the CSS of sub-info.  
  (サブ情報にCSS指定(word-wrap : break-word;)を追加しました。)


### v5.4 (2012-07-09)
- "prev_val" attribute is generated in text-box.  
  Ajax-search can also be prevented if you wish when you change the value of text-box dynamically.   
  (プラグインを適用したテキストボックスに"prev_val"という独自属性を設けることにより、ユーザー側ではなくサイト側でテキストボックスの値を動的に変更した際、Ajax検索することを阻止できるようになりました。)


### v5.3 (2012-07-07)
- The error that occurs when "NULL" is permitted at database and using "sub_info" option is corrected.  
  (データベースの値でNULLを許可している場合、サブ情報の表示に失敗する不具合を修正しました。)
- When "sub_info:'simple' and Sub-info is NULL, Sub-info is not displayed.  
  (sub_info:'simple' の場合、サブ情報の値が空白ならば表示させないようにしました。)


### v5.2 (2012-07-06)
- The error that occurs when "SQL reserved words" is used as table-name or field-name is corrected.  
  (テーブル名、フィールド名にSQLの予約語が使われている場合にエラーが出る不具合を修正しました。)


### v5.1 (2012-06-30)
- The naming for the hidden field that used "select_only" option, is adapted to CakePHP.  
  (セレクト専用オプションのための隠しフィールドのname属性の命名を、CakePHPにも対応しました。)


### v5.0 (2012-06-04)
- "minchars" option was abolished.  
  ("minchars"オプションを廃止しました。1文字から検索を行います。)
- "init_src" option was abolished.  
  ("init_src"オプションを廃止しました。送信先のPHPは"jquery.ajaxComboBox.php"に統一します。)
- "img_dir" option wasu abolished. Please set a path to "button_img" option.  
  ("img_dir"オプションを廃止しました。"button_img"は絶対パスまたは相対パスで指定して下さい。)
- "init_record" option was newly prepared instead of "init_val".  
  ("init_val"オプションを廃止して、代わりに"init_record"を新設します。データベースのプライマリキーの値を指定します。)
- "plugin_type" option was newly prepared. You can set "combobox" or "simple".  
  ("plugin_type"オプションを追加しました。通常の"combobox"と、ボタンのないシンプルな"simple"を選べます。)
- You can not change the name of CSS class which applied to this ComboBox.  
  (コンボボックスに適用されるCSSクラスの名称変更をオプションで指定することはできなくなりました。)
- The selected item is emphasized.  
  (選択された項目は、リスト内で太字で強調表示するようにしました。)