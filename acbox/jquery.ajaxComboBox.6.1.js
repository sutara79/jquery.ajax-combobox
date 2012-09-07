/*
jQuery Plugin
jquery.ajaxComboBox.6.1
Yuusaku Miyazaki (toumin.m7@gmail.com)
MIT License
*/
(function($) {
	//Start point
	$.fn.ajaxComboBox = function(_source, _options) {
		//return jQuery object to continue method chain.
		return this.each(function() {
			individual(this, _source, _options);
		});
	};
	//About each ComboBox 
	function individual(_jqobj, _source, _options) {
		//#1. Global vars
		var Opt  = initOptions(_source, _options);
		var Msg  = initMessages();
		var Cls  = initCssClassName();
		var Vars = initLocalVars();
		var Elem = initElements(_jqobj);

		//#2. Initial appearance
		$.ajaxSetup({cache: false});
		btnAttrDefault();
		btnPositionAdjust();
		setInitRecord();

		//#3. Event handler
		eHandlerForButton();
		eHandlerForInput();
		eHandlerForWhole();
		eHandlerForTextArea();
		
		if (Opt.shorten_url) findShort();

		//That's all.
		return true;


		//==============================================
		//#1. Global vars
		//==============================================
		//**********************************************
		//Initialize options of plugin
		//**********************************************
		//@called individual
		//@params obj,str _source  (the name of file for DB connect, or JSON object)
		//@params obj     _options (options sent by user)
		//@return obj
		function initOptions(_source, _options) {
			//----------------------------------------
			// 1st
			//----------------------------------------
			_options = $.extend({
				//基本設定
				source      : _source,
				lang        : 'ja',       //言語を選択(デフォルトは日本語)
				plugin_type : 'combobox',
				init_record : false,      //ComboBoxの初期値(DBのpkeyの値で指定する)
				db_table    : 'tbl',      //table for DB connect
				field       : 'name',     //column for display as suggest
				and_or      : 'AND',      //AND? OR? for search words
				per_page    : 10,         //候補一覧1ページに表示する件数
				navi_num    : 5,          //ページナビで表示するページ番号の数
				primary_key : 'id',       //候補選択後、selected_pkeyの値となるDBのカラム
				button_img  : 'acbox/jquery.ajaxComboBox.button.png',
				bind_to     : false,      //候補選択後に実行されるイベントの名前
				navi_simple : false,      //先頭、末尾のページへのリンクを表示するか？

				//サブ情報
				sub_info    : false, //true, false, 'simple'
				sub_as      : {},    //サブ情報での、カラム名の別名
				show_field  : '',    //サブ情報で表示するカラム(複数指定はカンマ区切り)
				hide_field  : '',    //サブ情報で非表示にするカラム(複数指定はカンマ区切り)

				//セレクト専用
				select_only : false, //セレクト専用にするかどうか？

				//タグ検索
				tags        : false,

				//URL短縮用
				shorten_url : false, //短縮実行ボタンのセレクタ
				shorten_src : 'acbox/bitly.php',
				shorten_min : 20,
				shorten_reg : false
			}, _options);
			//----------------------------------------
			// 2nd
			//----------------------------------------
			//検索するフィールド(カンマ区切りで複数指定可能)
			_options.search_field = (_options.search_field == undefined)
				? _options.field
				: _options.search_field;
			//----------------------------------------
			// 3rd
			//----------------------------------------
			//大文字で統一
			_options.and_or = _options.and_or.toUpperCase();

			//カンマ区切りのオプションを配列に変換する。
			var arr = ['hide_field', 'show_field', 'search_field'];
			for (var i=0; i<arr.length; i++) {
				_options[arr[i]] = _strToArray(_options[arr[i]]);
			}
			//----------------------------------------
			// 4th
			//----------------------------------------
			//CASE WHEN後のORDER BY指定
			_options.order_by = (_options.order_by == undefined)
				? _options.search_field
				: _options.order_by;
			//order_by を多層配列に
			//【例】 [ ['id', 'ASC'], ['name', 'DESC'] ]
			_options['order_by'] = _setOrderbyOption(_options['order_by'], _options['field']);
			//----------------------------------------
			// Textarea
			//----------------------------------------
			if (_options.plugin_type == 'textarea') {
				_options.shorten_reg = _setRegExpShort(_options.shorten_reg, _options.shorten_min);
			}
			if (_options.tags) {
				_options.tags = _setTagPattern(_options.tags);
			}
			//----------------------------------------
			// Return
			//----------------------------------------
			return _options;

			//++++++++++++++++++++++++++++++++++++++++++++++++++++++++
			//----------------------------------------------
			//カンマ区切りの文字列を配列にする。
			//----------------------------------------------
			function _strToArray(str) {
				return str.replace(/[\s　]+/g, '').split(',');
			}
			//----------------------------------------------
			//URL短縮用。 URLらしき文字列を検索するための正規表現。
			//----------------------------------------------
			function _setRegExpShort(shorten_reg, shorten_min) {
				if (shorten_reg) return shorten_reg; //ユーザが正規表現を設定しているなら、それを使う。
				var reg = '(?:^|[\\s|　\\[(<「『（【［＜〈《]+)';
				reg += '(';
				reg += 'https:\\/\\/[^\\s|　\\])>」』）】］＞〉》]{' + (shorten_min - 7) + ',}';
				reg += '|';
				reg += 'http:\\/\\/[^\\s|　\\])>」』）】］＞〉》]{'  + (shorten_min - 6) + ',}';
				reg += '|';
				reg += 'ftp:\\/\\/[^\\s|　\\])>」』）】］＞〉》]{'   + (shorten_min - 5) + ',}';
				reg += ')';
				return new RegExp(reg, 'g');
			}
			//----------------------------------------------
			//各タグについての設定
			//----------------------------------------------
			function _setTagPattern(tags) {
				for (var i=0; i<tags.length; i++) {
					//タグごとのDB接続設定
					tags[i] = _setTagOptions(tags[i]);

					//タグ抽出の正規表現を設定する。
					tags[i]['pattern'] = _setRegExpTag(tags[i]['pattern'], tags[i]['space']);
				}
				return tags;

				//----------------------------------------------
				//各タグの検索方法を設定する
				//----------------------------------------------
				function _setTagOptions(tag) {
					tag = $.extend({
						//スペース挿入
						space       : [true, true],
						
						//DB接続
						db_table    : _options.db_table,
						field       : _options.field,
						search_field: _options.search_field,
						primary_key : _options.primary_key,

						//サブ情報
						sub_info    : _options.sub_info,
						sub_as      : _options.sub_as,
						show_field  : _options.show_field,
						hide_field  : _options.hide_field
					}, tag);

					//カンマ区切りのオプションを配列に変換する。
					var arr = ['hide_field', 'show_field', 'search_field'];
					for (var i=0; i<arr.length; i++) {
						if (typeof tag[arr[i]] != 'object') {
							tag[arr[i]] = _strToArray(tag[arr[i]]);
						}
					}
					//order_byを配列にする
					tag.order_by = (tag.order_by == undefined)
						? _options.order_by
						: _setOrderbyOption(tag.order_by, tag.field);
					return tag;
				}
				//----------------------------------------------
				//各タグを抽出するための一連の正規表現を作成する。
				//----------------------------------------------
				function _setRegExpTag(pattern, space) {
					//ユーザオプションを正規表現エスケープ
					var esc_left  = pattern[0].replace(/[\s\S]*/, _escapeForReg);
					var esc_right = pattern[1].replace(/[\s\S]*/, _escapeForReg);
					
					return {
						//素のカッコ文字
						left : pattern[0],
						right : pattern[1],

						//キャレットの左側へ、開始カッコまでを抜き出す正規表現
						reg_left : new RegExp(
							esc_left + '((?:(?!' + esc_left + '|' + esc_right + ')[^\\s　])*)$'
						),
						//キャレットの右側へ、終了カッコまでを抜き出す正規表現
						reg_right : new RegExp(
							'^((?:(?!' + esc_left + '|' + esc_right + ')[^\\s　])+)'
						),
						//候補選択後、開始カッコ前にスペースを挿入するかを判断するための正規表現
						//これに当てはまらない場合、スペースを挿入する。
						space_left : new RegExp(
							'^' + esc_left + '$|[\\s　]+' + esc_left + '$'
						),
						//候補選択後、終了カッコ前にスペースを挿入するかを判断するための正規表現
						//これに当てはまらない場合、スペースを挿入する。
						space_right : new RegExp(
							'^$|^[\\s　]+'
						),
						//候補選択後、終了カッコを補完するかを判断するための正規表現
						comp_right : new RegExp(
							'^' + esc_right
						)
					};

					//----------------------------------------------
					//正規表現用にエスケープする。
					//----------------------------------------------
					function _escapeForReg(text) {
						return '\\u' + (0x10000 + text.charCodeAt(0)).toString(16).slice(1);
					}
				}
			}
			//----------------------------------------
			//"order_by"オプションを配列にする
			//----------------------------------------
			//コンボボックスとタグ、両方のorder_byの配列化に使用する。
			function _setOrderbyOption(arg_order, arg_field) {
				var arr = [];
				if (typeof arg_order == 'object') {
					for (var i=0; i<arg_order.length; i++) {
						var orders = $.trim(arg_order[i]).split(' ');
						arr[i] =  (orders.length == 2)
							? orders
							: [orders[0], 'ASC'];
					}
				} else {
					var orders = $.trim(arg_order).split(' ');
					if (orders.length == 2) {
						arr[0] = orders;
					} else {
						arr[0] = (orders[0].match(/^(ASC|DESC)$/i))
							? [arg_field, orders[0]]
							: [orders[0], 'ASC'];
					}
				}
				return arr;
			}	
		}
		//**********************************************
		//"title attr" for each languages
		//**********************************************
		//@called individual
		//@global obj Opt (use not only "Opt.lang", but "per_page" and others)
		//@return obj
		function initMessages() {
			switch (Opt.lang) {
				//English
				case 'en':
					return {
						add_btn     : 'Add button',
						add_title   : 'add a box',
						del_btn     : 'Del button',
						del_title   : 'delete a box',
						next        : 'Next',
						next_title  : 'Next' + Opt.per_page + ' (Right key)',
						prev        : 'Prev',
						prev_title  : 'Prev' + Opt.per_page + ' (Left key)',
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
						not_found   : 'not found'
					};
					break;

				//Spanish (Thanks Joaquin G. de la Zerda)
				case 'es':
					return {
						add_btn     : 'Agregar boton',
						add_title   : 'Agregar una opcion',
						del_btn     : 'Borrar boton',
						del_title   : 'Borrar una opcion',
						next        : 'Siguiente',
						next_title  : 'Proximas ' + Opt.per_page + ' (tecla derecha)',
						prev        : 'Anterior',
						prev_title  : 'Anteriores ' + Opt.per_page + ' (tecla izquierda)',
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
						not_found   : 'no encuentre'
					};
					break;

				//Japanese
				default:
					return {
						add_btn     : '追加ボタン',
						add_title   : '入力ボックスを追加します',
						del_btn     : '削除ボタン',
						del_title   : '入力ボックスを削除します',
						next        : '次へ',
						next_title  : '次の' + Opt.per_page + '件 (右キー)',
						prev        : '前へ',
						prev_title  : '前の' + Opt.per_page + '件 (左キー)',
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
						not_found   : '(0 件)'
					};
			}
		}
		//**********************************************
		//Set name of CSS class.
		//**********************************************
		//@called individual
		//@global obj Opt オプション
		//@return obj         クラス名の詰め合わせ
		function initCssClassName() {
			//各モード共通
			var class_name = {
				container      : 'ac_container', //ComboBoxを包むdivタグ
				container_open : 'ac_container_open',
				selected       : 'ac_selected',
				re_area   : 'ac_result_area', //結果リストの<div>
				navi      : 'ac_navi', //ページナビを囲む<div>
				results   : 'ac_results', //候補一覧を囲む<ul>
				re_off    : 'ac_results_off', //候補一覧(非選択状態)
				select    : 'ac_over', //選択中の<li>
				sub_info  : 'ac_subinfo', //サブ情報
				select_ok : 'ac_select_ok',
				select_ng : 'ac_select_ng',
				input_off : 'ac_input_off' //非選択状態
			};
			switch (Opt.plugin_type) {
				//コンボボックス
				case 'combobox':
					class_name = $.extend(class_name, {
						button    : 'ac_button', //ボタンのCSSクラス
						btn_on    : 'ac_btn_on', //ボタン(mover時)
						btn_out   : 'ac_btn_out', //ボタン(mout時)
						input     : 'ac_input', //テキストボックス
					});
					break;

				case 'simple':
					class_name = $.extend(class_name, {
						input     : 'ac_s_input' //テキストボックス
					});
					break;

				case 'textarea':
					class_name = $.extend(class_name, {
						input     : 'ac_textarea', //テキストボックス
						btn_short_off : 'ac_btn_short_off'
					});
					break;
			}
			return class_name;
		}
		//**********************************************
		//Initialize vars
		//**********************************************
		//@called individual
		//@global obj Opt 
		//@return obj
		function initLocalVars() {
			var localvars = {
				timer_valchange : false, //タイマー変数(一定時間ごとに入力値の変化を監視)
				is_suggest      : false, //リストのタイプ。false=>全件 / true=>予測
				page_all        : 1,     //全件表示の際の、現在のページ番号
				page_suggest    : 1,     //候補表示の際の、現在のページ番号
				max_all         : 1,     //全件表示の際の、全ページ数
				max_suggest     : 1,     //候補表示の際の、全ページ数
				is_paging       : false, //ページ移動か?
				is_loading      : false, //Ajaxで問い合わせ中かどうか？
				reserve_btn     : false, //ボタンの背景色変更の予約があるかどうか？
				reserve_click   : false, //マウスのキーを押し続ける操作に対応するためmousedownを検知
				xhr             : false, //XMLHttpオブジェクトを格納
				key_paging      : false, //キーでページ移動したか？
				key_select      : false, //キーで候補移動したか？？
				prev_value      : '',    //初期値

				//サブ情報
				size_navi       : null,  //サブ情報表示用(ページナビの高さ)
				size_results    : null,  //サブ情報表示用(リストの上枠線)
				size_li         : null,  //サブ情報表示用(候補一行分の高さ)
				size_left       : null,   //サブ情報表示用(リストの横幅)
				
				//タグ検索
				tag             : null
			};
			return localvars;
		}
		//**********************************************
		//Initialize HTML-elements 
		//**********************************************
		//@called individual
		//@params elem _jqobj
		//@global obj Cls
		//@global obj Opt
		//@return obj elems
		function initElements(_jqobj) {
			//----------------------------------------------
			//部品を作成
			//----------------------------------------------
			//本体
			var elems = {};
			elems.combo_input = $(_jqobj)
				.attr('autocomplete', 'off')
				.addClass(Cls.input)
				.wrap('<div>'); //This "div" is "container".

			elems.container = $(elems.combo_input).parent().addClass(Cls.container);
			elems.clear  = $('<div>').css('clear', 'left');
			if (Opt.plugin_type == 'combobox') {
				elems.button = $('<div>').addClass(Cls.button);
				elems.img    = $('<img>').attr('src', Opt.button_img);
			} else {
				elems.button = false;
				elems.img    = false;
			}
			//サジェストリスト
			elems.result_area = $('<div>').addClass(Cls.re_area);
			elems.navi        = $('<div>').addClass(Cls.navi);
			elems.navi_info   = $('<div>').addClass('info');
			elems.navi_p      = $('<p>');
			elems.results     = $('<ul>' ).addClass(Cls.results);
			elems.sub_info    = $('<div>').addClass(Cls.sub_info);

			//primary_keyカラムの値を送信するためのinput:hiddenを作成
			if (Opt.plugin_type == 'textarea') {
				elems.hidden = false;
			} else {
				var hidden_name = ($(elems.combo_input).attr('name') != undefined)
					? $(elems.combo_input).attr('name')
					: $(elems.combo_input).attr('id');	
				//CakePHP用の対策 例:data[search][user] -> data[search][user_primary_key]
				if (hidden_name.match(/\]$/)) {
					hidden_name = hidden_name.replace(/\]?$/, '_primary_key]');
				} else {
					hidden_name += '_primary_key';
				}
				elems.hidden = $('<input type="hidden" />')
					.attr({
						'name': hidden_name,
						'id'  : hidden_name
					})
					.val('');
			}
			//----------------------------------------------
			//部品をページに配置
			//----------------------------------------------
			switch (Opt.plugin_type) {
				case 'combobox':
					$(elems.container)
						.append(elems.button)
						.append(elems.clear)
						.append(elems.result_area)
						.append(elems.hidden);
					$(elems.button).append(elems.img);
					break;
				
				case 'simple':
					$(elems.container)
						.append(elems.clear)
						.append(elems.result_area)
						.append(elems.hidden);
					break;
				
				case 'textarea':
					$(elems.container)
						.append(elems.clear)
						.append(elems.result_area);
			}
			$(elems.result_area)
				.append(elems.navi)
				.append(elems.results)
				.append(elems.sub_info);
			$(elems.navi)
				.append(elems.navi_info)
				.append(elems.navi_p);


			//----------------------------------------------
			//サイズ調整
			//----------------------------------------------
			//ComboBoxの幅
			if (Opt.plugin_type == 'combobox') {
				$(elems.container).width(
					$(elems.combo_input).outerWidth() + $(elems.button).outerWidth()
				);
				//ボタンの高さ
				$(elems.button).height($(elems.combo_input).innerHeight());
			} else {
				$(elems.container).width($(elems.combo_input).outerWidth());
			}
			return elems;
		}
		//==============================================
		//#2. Initial appearance
		//==============================================
		//**********************************************
		//initialize "title attr" of button
		//**********************************************
		//@called individual
		function btnAttrDefault() {
			if (Opt.select_only) {
				if ($(Elem.combo_input).val() != '') {
					if (Opt.plugin_type != 'textarea') {
						if ($(Elem.hidden).val() != '') {
							//選択状態
							$(Elem.combo_input)
								.attr('title',Msg.select_ok)
								.removeClass(Cls.select_ng)
								.addClass(Cls.select_ok);
						} else {
							//入力途中
							$(Elem.combo_input)
								.attr('title',Msg.select_ng)
								.removeClass(Cls.select_ok)
								.addClass(Cls.select_ng);
						}
					}
				} else {
					//完全な初期状態へ戻す
					if (Opt.plugin_type != 'textarea') $(Elem.hidden).val('');
					$(Elem.combo_input)
						.removeAttr('title')
						.removeClass(Cls.select_ng)
				}
			}
			if (Opt.plugin_type == 'combobox') {
				$(Elem.button).attr('title', Msg.get_all_btn);
				$(Elem.img).attr('src', Opt.button_img);
			}
		}
		//**********************************************
		//ボタンの画像の位置を調整する
		//**********************************************
		//@called individual
		function btnPositionAdjust() {
			if (Opt.plugin_type != 'combobox') return;

			var width_btn  = $(Elem.button).innerWidth();
			var height_btn = $(Elem.button).innerHeight();
			var width_img  = $(Elem.img).width();
			var height_img = $(Elem.img).height();

			var left = width_btn / 2 - (width_img / 2);
			var top = height_btn / 2 - (height_img / 2);

			$(Elem.img).css({
				'top':top,
				'left':left
			});
		}
		//**********************************************
		//ComboBoxに初期値を挿入
		//**********************************************
		//@called individual
		//@return str  以前の値
		function setInitRecord() {
			if (Opt.init_record === false) return;
			//------------------------------------------
			//セレクト専用への値挿入
			//------------------------------------------
			//hiddenへ値を挿入
			if (Opt.plugin_type != 'textarea') $(Elem.hidden).val(Opt.init_record);

			//テキストボックスへ値を挿入
			if (typeof Opt.source == 'object') {
				//sourceがデータセットの場合
				for (var i=0; i<Opt.source.length; i++) {
					if (Opt.source[i][Opt.primary_key] == Opt.init_record) {
						var data = Opt.source[i];
						break;
					}
				}
				_afterInit(data);
			} else {
				$.getJSON(
					Opt.source,
					{
						db_table  : Opt.db_table,
						pkey_name : Opt.primary_key,
						pkey_val  : Opt.init_record
					},
					_afterInit
				);
			}
			//------------------------------------------
			//初期化用Ajax後の処理
			//------------------------------------------
			function _afterInit(data) {
				$(Elem.combo_input).val(data[Opt.field]);
				if (Opt.plugin_type != 'textarea') $(Elem.hidden).val(data[Opt.primary_key]);
				Vars.prev_value = data[Opt.field];
				if (Opt.select_only) {
					//選択状態
					$(Elem.combo_input)
						.attr('title',Msg.select_ok)
						.removeClass(Cls.select_ng)
						.addClass(Cls.select_ok);
				}
			}
		}
		//==============================================
		//#3. Event handler
		//==============================================
		//**********************************************
		//"get all" button
		//**********************************************
		//@called individual
		function eHandlerForButton() {
			if (Opt.plugin_type != 'combobox') return;

			$(Elem.button)
				.mouseup(function(ev) {
					if ($(Elem.result_area).is(':hidden')) {
						clearInterval(Vars.timer_valchange);
						Vars.is_suggest = false;
						suggest();
						$(Elem.combo_input).focus();
					} else {
						hideResults();
					}
					ev.stopPropagation();
				})
				.mouseover(function() {
					$(Elem.button)
						.addClass(Cls.btn_on)
						.removeClass(Cls.btn_out);
				})
				.mouseout(function() {
					$(Elem.button)
						.addClass(Cls.btn_out)
						.removeClass(Cls.btn_on);
				}).mouseout(); //default: mouseout
		}
		//**********************************************
		//text-box
		//**********************************************
		//@called individual
		function eHandlerForInput() {
			//for cross browser
			if (window.opera) {
				//for Opera
				$(Elem.combo_input).keypress(processKey);
			} else {
				//others
				$(Elem.combo_input).keydown(processKey);
			}
			$(Elem.combo_input)
				.focus(setTimerCheckValue)
				.click(function() {
					cssFocusInput();
					$(Elem.results).children('li').removeClass(Cls.select);
				});
		}
		//**********************************************
		//plugin whole
		//**********************************************
		//@called individual
		function eHandlerForWhole() {
			var stop_hide = false; //このプラグイン内でのマウスクリックなら、htmlでの候補消去を中止。
			$(Elem.container).mousedown(function(e) { stop_hide = true });
			$('html').mousedown(function() {
				if (stop_hide) stop_hide = false;
				else           hideResults();
			});
		}
		//**********************************************
		//list of suggests
		//**********************************************
		//@called displayResults
		function eHandlerForResults() {
			$(Elem.results)
				.children('li')
				.mouseover(function() {
					//Firefoxでは、候補一覧の上にマウスカーソルが乗っていると
					//うまくスクロールしない。そのための対策。 イベント中断。
					if (Vars.key_select) {
						Vars.key_select = false;
						return;
					}
					setSubInfo(this);

					$(Elem.results).children('li').removeClass(Cls.select);
					$(this).addClass(Cls.select);
					cssFocusResults();
				})
				.click(function(e) {
					//Firefoxでは、候補一覧の上にマウスカーソルが乗っていると
					//うまくスクロールしない。そのための対策。イベント中断。
					if (Vars.key_select) {
						Vars.key_select = false;
						return;
					}
					e.preventDefault();
					e.stopPropagation();
					selectCurrentLine(false);
				});
		}
		//**********************************************
		//paging of results
		//**********************************************
		//@called setNavi
		function eHandlerForNaviPaging() {
			//"<< 1"
			$(Elem.navi).find('.navi_first').mouseup(function(ev) {
				$(Elem.combo_input).focus();
				ev.preventDefault();
				firstPage();
			});

			//"< prev"
			$(Elem.navi).find('.navi_prev').mouseup(function(ev) {
				$(Elem.combo_input).focus();
				ev.preventDefault();
				prevPage();
			});

			//the number of page
			$(Elem.navi).find('.navi_page').mouseup(function(ev) {
				$(Elem.combo_input).focus();
				ev.preventDefault();

				if (!Vars.is_suggest) Vars.page_all     = parseInt($(this).text(), 10);
				else                  Vars.page_suggest = parseInt($(this).text(), 10);

				Vars.is_paging = true;
				suggest();
			});

			//"next >"
			$(Elem.navi).find('.navi_next').mouseup(function(ev) {
				$(Elem.combo_input).focus();
				ev.preventDefault();
				nextPage();
			});

			//"last >>"
			$(Elem.navi).find('.navi_last').mouseup(function(ev) {
				$(Elem.combo_input).focus();
				ev.preventDefault();
				lastPage();
			});
		}
		function eHandlerForTextArea() {
			if (!Opt.shorten_url) return;
			//URL短縮用ボタン
			$(Opt.shorten_url).click(getShortURL);
		}
		//==============================================
		//#4. Appearance
		//==============================================
		//**********************************************
		//image for loading
		//**********************************************
		//@called suggest
		function setLoading() {
			$(Elem.navi_info).text(Msg.loading);
			if ($(Elem.results).html() == '') {
				$(Elem.navi).children('p').empty();
				calcWidthResults();
				$(Elem.container).addClass(Cls.container_open);
			}
		}
		//**********************************************
		//選択候補を追いかけて画面をスクロール
		//**********************************************
		//キー操作による候補移動、ページ移動のみに適用
		//
		//@param boolean enforce 移動先をテキストボックスに強制するか？
		function scrollWindow(enforce) {
			//------------------------------------------
			//使用する変数を定義
			//------------------------------------------
			var current_result = getCurrentLine();

			var target_top = (current_result && !enforce)
				? current_result.offset().top
				: $(Elem.container).offset().top;

			var target_size;

			if (Opt.sub_info) {
				var dl = $(Elem.sub_info).children('dl:visible');
				target_size =
					$(dl).height() +
					parseInt($(dl).css('border-top-width'), 10) +
					parseInt($(dl).css('border-bottom-width'), 10);
			} else {
				Vars.size_li = $(Elem.results).children('li:first').outerHeight();
				target_size = Vars.size_li;
			}
			var client_height = document.documentElement.clientHeight;

			var scroll_top = (document.documentElement.scrollTop > 0)
				? document.documentElement.scrollTop
				: document.body.scrollTop;

			var scroll_bottom = scroll_top + client_height - target_size;

			//------------------------------------------
			//スクロール処理
			//------------------------------------------
			var gap;
			if ($(current_result).length) {
				if (target_top < scroll_top || target_size > client_height) {
					//上へスクロール
					//※ブラウザの高さがターゲットよりも低い場合もこちらへ分岐する。
					gap = target_top - scroll_top;

				} else if (target_top > scroll_bottom) {
					//下へスクロール
					gap = target_top - scroll_bottom;

				} else {
					//スクロールは行われない
					return;
				}

			} else if (target_top < scroll_top) {
				gap = target_top - scroll_top;
			}
			window.scrollBy(0, gap);
		}
		//**********************************************
		//候補リストを暗く、入力欄を明瞭に
		//サブ情報は隠す
		//**********************************************
		//@called hideResults, eHandlerForInput, processKey, notFoundDataBase, prepareResults, selectCurrentLine, nextLine, prevLine
		function cssFocusInput() {
			$(Elem.results).addClass(Cls.re_off);
			$(Elem.combo_input).removeClass(Cls.input_off);
			$(Elem.sub_info).children('dl').hide();
		}
		//**********************************************
		//候補リストを明瞭に、入力欄を暗く
		//**********************************************
		//@called eHandlerForResults, eHandlerForResults, prepareResults, nextLine, prevLine
		function cssFocusResults() {
			$(Elem.results).removeClass(Cls.re_off);
			$(Elem.combo_input).addClass(Cls.input_off);
		}
		//**********************************************
		//URL短縮ボタンを使用可能にする
		//**********************************************
		function btnShortEnable() {
			$(Opt.shorten_url)
				.removeClass(Cls.btn_short_off)
				.removeAttr('disabled');
		}
		//**********************************************
		//URL短縮ボタンを使用不可にする
		//**********************************************
		function btnShortDisable() {
			$(Opt.shorten_url)
				.addClass(Cls.btn_short_off)
				.attr('disabled', 'disabled');
		}
		//==============================================
		//#5. Input by user
		//==============================================
		//**********************************************
		//入力値変化監視をタイマーで予約
		//**********************************************
		//@called EH_input, checkValue
		function setTimerCheckValue() {
			Vars.timer_valchange = setTimeout(checkValue, 500);
		}
		//**********************************************
		//入力値変化監視を実行
		//**********************************************
		//@called processKey, setTimerCheckValue
		function checkValue() {
			var now_value = $(Elem.combo_input).val();
			if (now_value != Vars.prev_value) {
				Vars.prev_value = now_value;
				if(Opt.plugin_type == 'textarea') {
					//URLを探し、短縮ボタンを表示or非表示
					findShort();

					//タグとして検索すべき文字列を探す
					var tag = findTag(now_value);
					if (tag) {
						_setTextAreaNewSearch(tag);
						suggest(tag);
					}
				} else {
					//sub_info属性を削除
					$(Elem.combo_input).removeAttr('sub_info');

					//hiddenの値を削除
					if (Opt.plugin_type != 'textarea') $(Elem.hidden).val('');

					//セレクト専用時
					if (Opt.select_only) btnAttrDefault();

					//ページ数をリセット
					Vars.page_suggest = 1;

					Vars.is_suggest = true;
					
					suggest();
				}
			} else if (
				//textareaで、現在のタグから別のタグへ移動していないか検査する。
				Opt.plugin_type == 'textarea' &&
				$(Elem.result_area).is(':visible')
			) {
				var new_tag = findTag(now_value);
				if (!new_tag) {
					hideResults();
				} else if (
					new_tag.str != Vars.tag.str ||
					new_tag.pos_left != Vars.tag.pos_left
				) {
					_setTextAreaNewSearch(new_tag);
					suggest();
				}
			}
			//一定時間ごとの監視を再開
			setTimerCheckValue();
		}
		function _setTextAreaNewSearch(tag) {
			Vars.tag          = tag;
			Vars.page_suggest = 1;
			Opt.search_field  = Opt.tags[Vars.tag.type].search_field;
			Opt.order_by      = Opt.tags[Vars.tag.type].order_by;
			Opt.primary_key   = Opt.tags[Vars.tag.type].primary_key;
			Opt.db_table      = Opt.tags[Vars.tag.type].db_table;
			Opt.field         = Opt.tags[Vars.tag.type].field;
			Opt.sub_info      = Opt.tags[Vars.tag.type].sub_info;
			Opt.sub_as        = Opt.tags[Vars.tag.type].sub_as;
			Opt.show_field    = Opt.tags[Vars.tag.type].show_field;
			Opt.hide_field    = Opt.tags[Vars.tag.type].hide_field;
		}
		//***************************************************
		//URLを探し、短縮ボタンを表示or非表示
		//***************************************************
		//@called 
		function findShort() {
			var flag = null;
			var arr  = null; //ループの中で一時的に使用

			while ((arr = Opt.shorten_reg.exec($(Elem.combo_input).val())) != null) {
				flag = true;
				Opt.shorten_reg.lastIndex = 0; //execのループを中断するなら、必ずリセットしておくこと!
				break;
			}
			if (flag) btnShortEnable();
			else btnShortDisable();
		}
		//***************************************************
		//AjaxでURLを短縮してもらう
		//***************************************************
		//@called setEventHandler
		function getShortURL() {
			//テキストエリアを入力禁止に
			$(Elem.combo_input).attr('disabled', 'disabled');
		
			var text    = $(Elem.combo_input).val(); //Ajax後も使用する
			var matches = [];   //結果を最終的に格納する
			var arr     = null; //ループの中で一時的に使用

			while ((arr = Opt.shorten_reg.exec(text)) != null) {
				matches[matches.length] = arr[1];			
			}

			//URLがなければ、ここで終了。
			//ボタンが表示された直後に文章が変更された場合などに対応
			if (matches.length < 1) {
				//テキストエリアを入力可能に
				$(Elem.combo_input).removeAttr('disabled');
				return;
			}
		
			//可変長オブジェクトを引数にする
			var obj_param = {};
			for (var i=0; i<matches.length; i++) {
				obj_param['p_'+i] = matches[i];
			}
			//bitlyへ送信
			$.getJSON(
				Opt.shorten_src,
				obj_param,
				function (json) {
					//元URLと短縮URLを順番に置換する
					var i = 0;
					var result = text.replace(Opt.shorten_reg, function(){
						var matched = arguments[0].replace(arguments[1], json[i]);
						i++;
						return matched;
					});

					//画面を整える
					$(Elem.combo_input).val(result);
					Vars.prev_value = result;
					$(Elem.combo_input).focus();
					btnShortDisable();
				
					//テキストエリアを入力可能に
					$(Elem.combo_input).removeAttr('disabled');
				}
			);
		}
		//***************************************************
		//キャレット位置周辺の文字列を抜き出す
		//***************************************************
		//@called
		//@params str now_value テキストエリア全文
		//@return arr           キャレット位置周辺の文字列と、抜き出す範囲(左、右)のオブジェクト配列
		function findTag(now_value) {
			//キャレット位置を取得
			var pos  = getCaretPos($(Elem.combo_input).get(0));

			//for Opera.
			//selectionStartで改行を2文字分に認識してしまう仕様に対応する。
			//"pos"をsubstringで正しく扱える値に修正する。
			if (window.opera) {
				var textwhole = $(Elem.combo_input).val();
				var textdouble = textwhole.replace(/\n/g, '\nq');
				var range = textdouble.substr(0, pos);
				var arr_skip = range.match(/\n/g);
				var len_skip = (arr_skip)
					? arr_skip.length
					: 0;
				pos = pos - len_skip;
			}
			//抽出したタグの情報を保存する。
			for (var i=0; i<Opt.tags.length; i++) {
				//-----------------------------------------------
				//キャレット位置から左へ空白までを抜き出す
				//-----------------------------------------------
				var left = now_value.substring(0, pos);
				left = left.match(Opt.tags[i].pattern.reg_left);
				if (!left) continue;
				left = left[1]; //短縮していることに注意!
				var pos_left = pos - left.length;
				if (pos_left < 0) pos_left = 0;
			
				//-----------------------------------------------
				//キャレット位置から右へ空白までを抜き出す
				//-----------------------------------------------
				var right = now_value.substring(pos, now_value.length);
				right = right.match(Opt.tags[i].pattern.reg_right);
				if (right) {
					right = right[1]; //短縮していることに注意!
					var pos_right = pos + right.length;
				} else {
					right = '';
					var pos_right = pos;
				}
				var str = left + '' + right;
				Vars.is_suggest = (str == '') ? false : true;
				return {
					type      : i,
					str       : str,
					pos_left  : pos_left,
					pos_right : pos_right
				};
			}
			return false;
		}
		//***************************************************
		//キャレットの位置を取得
		//***************************************************
		//@called
		//@params element item プラグイン呼び出し元の要素( $(elem).get(0) )
		//@return int          キャレットの現在位置
		function getCaretPos(item) {
			var pos = 0;
			//---------------------------------------------------
			//ブラウザ分岐
			//---------------------------------------------------
			if (document.selection) {
				// IE
				item.focus();
				var Sel = document.selection.createRange();
				Sel.moveStart ("character", -item.value.length);
				pos = Sel.text.length;

			} else if (item.selectionStart || item.selectionStart == "0") {
				// Firefox, Chrome
				pos = item.selectionStart;
			}
			return pos;
		}
		//***************************************************
		//指定位置にキャレットを移動
		//***************************************************
		//@called ajaxShortURL
		//@params int     pos  キャレットを移動させる位置
		function setCaretPos(pos) {
			var item = $(Elem.combo_input).get(0);
			//---------------------------------------------------
			//ブラウザ分岐
			//---------------------------------------------------
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
		}
		//**********************************************
		//キー入力への対応
		//**********************************************
		//@params obj e (event object)
		//@called eHandlerForInput
		function processKey(e) {
			if (
				($.inArray(e.keyCode, [27,38,40,9]) > -1 && $(Elem.result_area).is(':visible')) ||
				($.inArray(e.keyCode, [37,39,13,9]) > -1 && getCurrentLine()) ||
				(e.keyCode == 40 && Opt.plugin_type != 'textarea')
			) {
				e.preventDefault();
				e.stopPropagation();
				e.cancelBubble = true;
				e.returnValue  = false;

				switch (e.keyCode) {
					case 37: //left
						if (e.shiftKey) firstPage();
						else            prevPage();
						break;

					case 38: //up
						Vars.key_select = true;
						prevLine();
						break;

					case 39: //right
						if (e.shiftKey) lastPage();
						else            nextPage();
						break;

					case 40: //down
						if ($(Elem.results).children('li').length) {
							Vars.key_select = true;
							nextLine();
						} else {
							Vars.is_suggest = false;
							suggest();
						}
						break;

					case 9:  //tab
						Vars.key_paging = true;
						hideResults();
						break;

					case 13: //return
						selectCurrentLine(true);
						break;

					case 27: //	escape
						Vars.key_paging = true;
						hideResults();
						break;
				}

			} else {
				if (e.keyCode != 16) cssFocusInput(); //except Shift(16)
				checkValue();
			}
		}
		//==============================================
		//#6. Search
		//==============================================
		//**********************************************
		//abort Ajax
		//**********************************************
		//@called suggest, hideResults
		function abortAjax() {
			if (Vars.xhr) {
				Vars.xhr.abort();
				Vars.xhr = false;
			}
		}
		//**********************************************
		//send request to PHP(server side)
		//**********************************************
		//@called firstPage, nextPage, prevPage, lastPage, eHandlerForButton, eHandlerForNaviPaging, checkValue, processKey
		function suggest() {
			if (Opt.plugin_type != 'textarea') {
				var q_word = (Vars.is_suggest) ? $.trim($(Elem.combo_input).val()) : '';
				if (q_word.length < 1 && Vars.is_suggest) {
					hideResults();
					return;
				}
				q_word = q_word.split(/[\s　]+/);
			} else {
				var q_word = [Vars.tag.str];
			}

			abortAjax(); //Ajax通信をキャンセル
			setLoading(); //ローディング表示
			$(Elem.sub_info).children('dl').hide(); //サブ情報消去

			//ここで、本来は真偽値が格納される変数に数値を格納している。
			if (Vars.is_paging) {
				var obj = getCurrentLine();
				if (obj) {
					Vars.is_paging = $(Elem.results).children('li').index(obj);
				} else {
					Vars.is_paging = -1;
				}
			} else if (!Vars.is_suggest) {
				Vars.is_paging = 0;
			}

			var which_page_num = (Vars.is_suggest) ? Vars.page_suggest : Vars.page_all;

			//データ取得
			if (typeof Opt.source == 'object') searchForJSON(q_word, which_page_num);
			else searchForDB(q_word, which_page_num);
			
		}
		//**********************************************
		//DBから返されたそのままのオブジェクトを、候補リストを生成しやすいように加工する。
		//**********************************************
		//@called suggest
		function searchForDB(q_word, which_page_num) {
			Vars.xhr = $.getJSON(
				Opt.source,
				{
					q_word       : q_word,
					page_num     : which_page_num,
					per_page     : Opt.per_page,
					search_field : Opt.search_field,
					and_or       : Opt.and_or,
					order_by     : Opt.order_by,
					db_table     : Opt.db_table
				},
				function(json) {
					json.candidate   = [];
					json.primary_key = [];
					json.subinfo     = [];
					if (typeof json.result != 'object') {
						//検索結果はゼロだった。
						Vars.xhr = null;
						notFoundDataBase();
						return;
					}
					json.cnt_page = json.result.length;
					for (i=0; i<json.cnt_page; i++) {
						json.subinfo[i] = [];
						for (key in json.result[i]) {
							if (key == Opt.primary_key) {
								json.primary_key.push(json.result[i][key]);
							}
							if (key == Opt.field) {
								json.candidate.push(json.result[i][key]);
							} else if ($.inArray(key, Opt.hide_field) == -1) {
								if (
									Opt.show_field != ''                 &&
									$.inArray('*', Opt.show_field) == -1 &&
									$.inArray(key, Opt.show_field) == -1
								) {
									continue;
								} else {
									json.subinfo[i][key] = json.result[i][key];
								}
							}
						}
					}
					delete(json.result);
					Vars.xhr = null;
					prepareResults(json, q_word, which_page_num);
				}
			);
		}
		//**********************************************
		//データベースではなく、JSONを検索
		//**********************************************
		//@called suggest
		function searchForJSON(q_word, which_page_num) {
			var matched = [];
			var esc_q = [];
			var sorted = [];
			var json = {};

			var i = 0;
			var arr_reg = [];
			do { //全件表示のため、do-while文を使う。
				//正規表現のメタ文字をエスケープ
				esc_q[i] = q_word[i].replace(/\W/g,'\\$&').toString();
				arr_reg[i] = new RegExp(esc_q[i], 'gi');
				i++;
			} while (i<q_word.length);


			//SELECT * FROM source WHERE field LIKE q_word;
			for (var i=0; i<Opt.source.length; i++) {
				var flag = false;
				for (var j=0; j<arr_reg.length; j++) {
					if (Opt.source[i][Opt.field].match(arr_reg[j])) {
						flag = true;
						if (Opt.and_or == 'OR') break;
					} else {
						flag = false;
						if (Opt.and_or == 'AND') break;
					}
				}
				if (flag) {
					matched.push(Opt.source[i]);
				}
			}
			//見つからなければすぐに終了
			if (matched.length == undefined) {
				notFoundDataBase();
				return;
			}
			json.cnt_whole = matched.length;

			//(CASE WHEN ...)の後に続く order 指定
			var reg1 = new RegExp('^' + esc_q[0] + '$', 'gi');
			var reg2 = new RegExp('^' + esc_q[0], 'gi');
			var matched1 = [];
			var matched2 = [];
			var matched3 = [];
			for (var i=0; i<matched.length; i++) {
				if (matched[i][Opt.order_by[0][0]].match(reg1)) {
					matched1.push(matched[i]);
				} else if (matched[i][Opt.order_by[0][0]].match(reg2)) {
					matched2.push(matched[i]);
				} else {
					matched3.push(matched[i]);
				}
			}
			if (Opt.order_by[0][1].match(/^asc$/i)) {
				matched1.sort(compareASC);
				matched2.sort(compareASC);
				matched3.sort(compareASC);
			} else {
				matched1.sort(compareDESC);
				matched2.sort(compareDESC);
				matched3.sort(compareDESC);
			}
			sorted = sorted.concat(matched1).concat(matched2).concat(matched3);

			//----------------------------------------------
			//searchInsteadOfDB内のsort用の比較関数
			//----------------------------------------------
			function compareASC(a, b) {
				return a[Opt.order_by[0][0]].localeCompare(b[Opt.order_by[0][0]]);
			}
			function compareDESC(a, b) {
				return b[Opt.order_by[0][0]].localeCompare(a[Opt.order_by[0][0]]);
			}

			//LIMIT xx OFFSET xx
			var start = (which_page_num - 1) * Opt.per_page;
			var end   = start + Opt.per_page;
			//----------------------------------------------
			//最終的に返るオブジェクトを作成
			//----------------------------------------------
			for (var i=start, sub=0; i<end; i++, sub++) {
				if (sorted[i] == undefined) break;

				for (var key in sorted[i]) {
					//セレクト専用
					if (key == Opt.primary_key) {
						if (json.primary_key == undefined) json.primary_key = [];
						json.primary_key.push(sorted[i][key]);
					}
					if (key == Opt.field) {
						//変換候補を取得
						if (json.candidate == undefined) json.candidate = [];
						json.candidate.push(sorted[i][key]);
					} else {
						//サブ情報
						if ($.inArray(key, Opt.hide_field) == -1) {
							if (
								Opt.show_field != ''                 &&
								$.inArray('*', Opt.show_field) == -1 &&
								$.inArray(key, Opt.show_field) == -1
							) {
								continue;
							}
							if (json.subinfo == undefined) {
								json.subinfo = [];
							}
							if (json.subinfo[sub] == undefined) {
								json.subinfo[sub] = [];
							}
							json.subinfo[sub][key] = sorted[i][key];
						}
					}
				}
			}
			json.cnt_page = json.candidate.length;
			prepareResults(json, q_word, which_page_num);
		}
		//**********************************************
		//問い合わせ該当件数ゼロだった場合
		//**********************************************
		//@called searchForDB, searchForJSON
		function notFoundDataBase() {
			$(Elem.navi_info).text(Msg.not_found);
			$(Elem.navi_p).hide();
			$(Elem.results).empty();
			$(Elem.sub_info).empty();
			//$(Elem.result_area).show();
			calcWidthResults();
			$(Elem.container).addClass(Cls.container_open);
			cssFocusInput();
		}
		//==============================================
		//#7. Show or hide results
		//==============================================
		//**********************************************
		//候補表示の準備
		//**********************************************
		//@called searchForDB, searchForJSON
		//DB, JSONで分岐していた処理が、ここで合流する。
		function prepareResults(json, q_word, which_page_num) {
			//1ページのみでもナビを表示する
			setNavi(json.cnt_whole, json.cnt_page, which_page_num);

			if (!json.subinfo || !Opt.sub_info) json.subinfo = false;
			if (!json.primary_key) json.primary_key = false;

			//セレクト専用時
			//本来なら、候補リストから選ばなければならないが、
			//候補の数が一つで、その候補の文字列と入力文字列が一致する場合、
			//『リストから選ばれた』と判断する。
			if (
				Opt.select_only &&
				json.candidate.length === 1 &&
				json.candidate[0] == q_word[0]
			) {
				if (Opt.plugin_type != 'textarea') $(Elem.hidden).val(json.primary_key[0]);
				btnAttrDefault();
			}
			//候補リストを表示する
			displayResults(json.candidate, json.subinfo, json.primary_key);
			if (Vars.is_paging === false) {
				cssFocusInput();
			} else {
				//全件表示とページ移動時、直前の行番号と同じ候補を選択状態にする
				var idx = Vars.is_paging; //真偽値を収めるべき変数に、例外的に数値が入っている。
				var limit = $(Elem.results).children('li').length - 1;
				if (idx > limit) idx = limit;
				var obj = $(Elem.results).children('li').eq(idx);
				$(obj).addClass(Cls.select);
				setSubInfo(obj);
				Vars.is_paging = false; //次回に備えて初期化する

				cssFocusResults();
			}
		}
		//**********************************************
		//ナビ部分を作成
		//**********************************************
		//@param integer cnt_whole   All number of records.
		//@param integer cnt_page    Cadidates of this page.
		//@param integer page_num    全件、または予測候補の一覧のページ数
		function setNavi(cnt_whole, cnt_page, page_num) {

			var num_page_top = Opt.per_page * (page_num - 1) + 1;
			var num_page_end = num_page_top + cnt_page - 1;

			var cnt_result = Msg.page_info
				.replace('cnt_whole'    , cnt_whole)
				.replace('num_page_top' , num_page_top)
				.replace('num_page_end' , num_page_end);

			$(Elem.navi_info).text(cnt_result);

			//----------------------------------------------
			//ページング部分
			//----------------------------------------------
			var last_page = Math.ceil(cnt_whole / Opt.per_page); //全ページ数
			if (last_page > 1) {
				$(Elem.navi_p).empty();
				//ページ数
				if (Vars.is_suggest) {
					Vars.max_suggest = last_page;
				} else {
					Vars.max_all = last_page;
				}

				//表示する一連のページ番号の左右端
				var left  = page_num - Math.ceil ((Opt.navi_num - 1) / 2);
				var right = page_num + Math.floor((Opt.navi_num - 1) / 2);
				//現ページが端近くの場合のleft,rightの調整
				while (left < 1) {
					left ++;
					right++;
				}
				while (right > last_page) right--;
				while ((right-left < Opt.navi_num - 1) && left > 1) left--;

				//『<< 前へ』の表示
				if (page_num == 1) {
					if (!Opt.navi_simple) {
						$('<span></span>')
							.text('<< 1')
							.addClass('page_end')
							.appendTo(Elem.navi_p);
					}
					$('<span></span>')
						.text(Msg.prev)
						.addClass('page_end')
						.appendTo(Elem.navi_p);
				} else {
					if (!Opt.navi_simple) {
						$('<a></a>')
							.attr({'href':'javascript:void(0)','class':'navi_first'})
							.text('<< 1')
							.attr('title', Msg.first_title)
							.appendTo(Elem.navi_p);
					}
					$('<a></a>')
						.attr({'href':'javascript:void(0)','class':'navi_prev'})
						.text(Msg.prev)
						.attr('title', Msg.prev_title)
						.appendTo(Elem.navi_p);
				}

				//各ページへのリンクの表示
				for (i = left; i <= right; i++) {
					//現在のページ番号は<span>で囲む(強調表示用)
					var num_link = (i == page_num)
						? '<span class="current">'+i+'</span>'
						: i;
					$('<a></a>')
						.attr({'href':'javascript:void(0)','class':'navi_page'})
						.html(num_link)
						.appendTo(Elem.navi_p);
				}

				//『次のX件 >>』の表示
				if (page_num == last_page) {
					$('<span></span>')
						.text(Msg.next)
						.addClass('page_end')
						.appendTo(Elem.navi_p);
					if (!Opt.navi_simple) {
						$('<span></span>')
							.text(last_page + ' >>')
							.addClass('page_end')
							.appendTo(Elem.navi_p);
					}
				} else {
					$('<a></a>')
						.attr({'href':'javascript:void(0)','class':'navi_next'})
						.text(Msg.next)
						.attr('title', Msg.next_title)
						.appendTo(Elem.navi_p);
					if (!Opt.navi_simple) {
						$('<a></a>')
							.attr({'href':'javascript:void(0)','class':'navi_last'})
							.text(last_page + ' >>')
							.attr('title', Msg.last_title)
							.appendTo(Elem.navi_p);
					}
				}
				$(Elem.navi_p).show();
				eHandlerForNaviPaging(); //イベントハンドラ設定
			} else {
				$(Elem.navi_p).hide();
			}
		}
		//**********************************************
		//サブ情報を表示する
		//**********************************************
		//@params object  obj   サブ情報を右隣に表示させる<li>要素
		//@called eHandlerForResults, nextLine, prevLine
		function setSubInfo(obj) {
			//サブ情報を表示しない設定なら、ここで終了
			if (!Opt.sub_info) return; 

			//サブ情報の座標設定用の基本情報
			Vars.size_results = ($(Elem.results).outerHeight() - $(Elem.results).height()) / 2;
			Vars.size_navi    = $(Elem.navi).outerHeight();
			Vars.size_li      = $(Elem.results).children('li:first').outerHeight();
			Vars.size_left    = $(Elem.results).outerWidth();

			//現在の<li>の番号は？
			var idx = $(Elem.results).children('li').index(obj);

			//一旦、サブ情報全非表示 (<dl>単位で非表示にする)
			$(Elem.sub_info).children('dl').hide();

			//位置調整
			var t_top = 0;
			if ($(Elem.navi).css('display') != 'none') t_top += Vars.size_navi;
			t_top += (Vars.size_results + Vars.size_li * idx);
			var t_left = Vars.size_left;

			t_top  += 'px';
			t_left += 'px';

			$(Elem.sub_info).children('dl').eq(idx).css({
				'position': 'absolute',
				'top'     : t_top,
				'left'    : t_left,
				'display' : 'block'
			});
		}
		//**********************************************
		//候補一覧の<ul>成形、表示
		//**********************************************
		//@params array arr_candidate   DBから検索・取得した値の配列
		//@params array arr_subinfo    サブ情報の配列
		//@params array arr_primary_key 主キーの配列
		//@called prepareResults
		function displayResults(arr_candidate, arr_subinfo, arr_primary_key) {
			//候補リストを、一旦リセット
			$(Elem.results).empty();
			$(Elem.sub_info).empty();
			for (var i = 0; i < arr_candidate.length; i++) {

				//候補リスト
				var list = $('<li>')
					.text(arr_candidate[i]) //!!! against XSS !!!
					.attr({
						pkey  : arr_primary_key[i],
						title : arr_candidate[i]
					});

				if (
					Opt.plugin_type != 'textarea' &&
					arr_primary_key[i] == $(Elem.hidden).val()
				) {
					$(list).addClass(Cls.selected);
				}
				$(Elem.results).append(list);

				//サブ情報のdlを生成
				if (arr_subinfo) {
					//sub_info属性にJSON文字列そのままを格納
					var str_subinfo = [];
					var $dl = $('<dl>');
					//テーブルの各行を生成
					for (key in arr_subinfo[i]) {
						//sub_info属性の値を整える
						var json_key = key.replace('\'', '\\\'');

						if (arr_subinfo[i][key] == null) {
							//DBのデータ値がnullの場合の対処
							arr_subinfo[i][key] = '';
						} else {
							//DBのデータ値が数値の場合の対処
							arr_subinfo[i][key] += '';
						}
						var json_val = arr_subinfo[i][key].replace('\'', '\\\'');

						str_subinfo.push("'" + json_key + "':" + "'" + json_val + "'");

						//thの別名を検索する
						if (Opt.sub_as[key] != null) var dt = Opt.sub_as[key];
						else 	                      var dt = key;

						dt = $('<dt>').text(dt); //!!! against XSS !!!
						if (Opt.sub_info == 'simple') $(dt).addClass('hide');
						$dl.append(dt);

						var dd = $('<dd>').text(arr_subinfo[i][key]); //!!! against XSS !!!
						$dl.append(dd);
					}
					//sub_info属性を候補リストのliに追加
					str_subinfo = '{' + str_subinfo.join(',') + '}';
					$(list).attr('sub_info', str_subinfo);
					
					$(Elem.sub_info).append($dl);
					if (Opt.sub_info == 'simple' && $dl.children('dd').text() == '') {
						$dl.addClass('ac_dl_empty');
					}
				}
			}

			//サジェスト結果表示
			//表示のたびに、結果リストの位置を調整しなおしている。
			//このプラグイン以外でページ内の要素の位置をずらす処理がある場合に対処するため。
			calcWidthResults();

			$(Elem.container).addClass(Cls.container_open);
			eHandlerForResults(); //イベントハンドラ設定

			//ボタンのtitle属性変更(閉じる)
			if (Opt.plugin_type == 'combobox') $(Elem.button).attr('title',Msg.close_btn);
		}
		function calcWidthResults() {
			//候補の幅とトップ位置を再計算 (textareaがリサイズされることに対処するため)
			//ComboBoxの幅
			if (Opt.plugin_type == 'combobox') {
				var w = $(Elem.combo_input).outerWidth() + $(Elem.button).outerWidth();
			} else {
				var w = $(Elem.combo_input).outerWidth();
			}
			$(Elem.container).width(w);
			
			//containerのpositionの値に合わせてtop,leftを設定する。
			if ($(Elem.container).css('position') == 'static') {
				//position: static
				var offset = $(Elem.combo_input).offset();
				$(Elem.result_area).css({
					top  : offset.top + $(Elem.combo_input).outerHeight() + 'px',
					left : offset.left + 'px'
				});
			} else {
				//position: relative, absolute, fixed
				$(Elem.result_area).css({
					top  : $(Elem.combo_input).outerHeight() + 'px',
					left : '0px'
				});
			}
			//幅を設定した後、表示する。
			$(Elem.result_area)
				.width(
					$(Elem.container).width() -
					($(Elem.result_area).outerWidth() - $(Elem.result_area).innerWidth())
				)
				.show();
		}
		//**********************************************
		//候補エリアを消去
		//**********************************************
		//@called eHandlerForButton, eHandlerForWhole, processKey, suggest, selectCurrentLine
		function hideResults() {
			if (Vars.key_paging) {
				//選択候補を追いかけてスクロール
				scrollWindow(true);
				Vars.key_paging = false;
			}
			cssFocusInput();

			$(Elem.results).empty();
			$(Elem.sub_info).empty();
			$(Elem.result_area).hide();
			$(Elem.container).removeClass(Cls.container_open);

			abortAjax();      //Ajax通信をキャンセル
			btnAttrDefault(); //ボタンのtitle属性初期化
		}
		//==============================================
		//#8. Paging
		//==============================================
		//**********************************************
		//1ページ目へ
		//**********************************************
		//@called processKey, eHandlerForNaviPaging
		function firstPage() {
			if (!Vars.is_suggest) {
				if (Vars.page_all > 1) {
					Vars.page_all = 1;
					Vars.is_paging = true;
					suggest();
				}
			} else {
				if (Vars.page_suggest > 1) {
					Vars.page_suggest = 1;
					Vars.is_paging = true;
					suggest();
				}
			}
		}
		//**********************************************
		//前のページへ
		//**********************************************
		//@called processKey, eHandlerForNaviPaging
		function prevPage() {
			if (!Vars.is_suggest) {
				if (Vars.page_all > 1) {
					Vars.page_all--;
					Vars.is_paging = true;
					suggest();
				}
			} else {
				if (Vars.page_suggest > 1) {
					Vars.page_suggest--;
					Vars.is_paging = true;
					suggest();
				}
			}
		}
		//**********************************************
		//次のページへ
		//**********************************************
		//@called processKey, eHandlerForNaviPaging
		function nextPage() {
			if (Vars.is_suggest) {
				if (Vars.page_suggest < Vars.max_suggest) {
					Vars.page_suggest++;
					Vars.is_paging = true;
					suggest();
				}
			} else {
				if (Vars.page_all < Vars.max_all) {
					Vars.page_all++;
					Vars.is_paging = true;
					suggest();
				}
			}
		}
		//**********************************************
		//最後のページへ
		//**********************************************
		//@called processKey, eHandlerForNaviPaging
		function lastPage() {
			if (!Vars.is_suggest) {
				if (Vars.page_all < Vars.max_all) {
					Vars.page_all = Vars.max_all;
					Vars.is_paging = true;
					suggest();
				}
			} else {
				if (Vars.page_suggest < Vars.max_suggest) {
					Vars.page_suggest = Vars.max_suggest;
					Vars.is_paging = true;
					suggest();
				}
			}
		}
		//==============================================
		//#9. Select line
		//==============================================
		//**********************************************
		//現在選択中の候補に決定する
		//**********************************************
		//@called processKey, eHandlerForResults
		function selectCurrentLine(is_enter_key) {

			//選択候補を追いかけてスクロール
			scrollWindow(true);

			var current = getCurrentLine();

			if (current) {
				if (Opt.plugin_type != 'textarea') {
					$(Elem.combo_input).val($(current).text());
					//サブ情報があるならsub_info属性を追加・書き換え
					if (Opt.sub_info) {
						$(Elem.combo_input).attr('sub_info', $(current).attr('sub_info'));
					}
					if (Opt.select_only) btnAttrDefault();
					$(Elem.hidden).val($(current).attr('pkey'));
				} else {
					var left = Vars.prev_value.substring(0, Vars.tag.pos_left);
					var right = Vars.prev_value.substring(Vars.tag.pos_right);
					//閉じカッコがあるタグの場合、rightの冒頭がその形式でない場合は追加する。
					//前後にスペースを挿入するかどうかもここで判断する。
					//行頭の場合はスペースは挿入しない。
					var ctext = $(current).text();
					//左側空白の補完
					if (
						Opt.tags[Vars.tag.type].space[0] &&
						!left.match(Opt.tags[Vars.tag.type].pattern.space_left)
					) {
						var p_len = Opt.tags[Vars.tag.type].pattern.left.length;
						var l_len = left.length;
						left = left.substring(0, (l_len - p_len)) +
							' ' +
							left.substring((l_len - p_len));
					}
					//右側カッコの補完
					if (!right.match(Opt.tags[Vars.tag.type].pattern.comp_right)) {
						right = Opt.tags[Vars.tag.type].pattern.right + right;
					}
					//右側空白の補完
					if (
						Opt.tags[Vars.tag.type].space[1] &&
						!right.match(Opt.tags[Vars.tag.type].pattern.space_right)
					) {
						var p_len = Opt.tags[Vars.tag.type].pattern.right.length;
						right = right.substring(0, p_len) +
							' ' +
							right.substring(p_len);
					}

					$(Elem.combo_input).val(left + '' + ctext + '' + right);

					var pos = left.length + ctext.length;
					//for Opera.
//%					if (window.opera) {
						var skip = left + '' + ctext;
						skip = skip.match(/\n/g);
						skip = (skip) ? skip.length : 0;
						pos += skip;
//%					}
					setCaretPos(pos);
				}
				
				Vars.prev_value = $(Elem.combo_input).val();
				hideResults();
			}
			if (Opt.bind_to) {
			 	//候補選択を引き金に、イベントを発火する
				$(Elem.combo_input).trigger(Opt.bind_to, is_enter_key);
			}
			$(Elem.combo_input).focus();  //テキストボックスにフォーカスを移す
			$(Elem.combo_input).change(); //テキストボックスの値が変わったことを通知
			cssFocusInput();
		}
		//**********************************************
		//現在選択中の候補の情報を取得
		//**********************************************
		//@return object current_result 現在選択中の候補のオブジェクト(<li>要素)
		//@called scrollWindow, processKey, selectCurrentLine, suggest, nextLine, prevLine
		function getCurrentLine() {
			if ($(Elem.result_area).is(':hidden')) return false;
			var obj = $(Elem.results).children('li.' + Cls.select);
			if ($(obj).length) return obj;
			else return false;
		}
		//**********************************************
		//選択候補を次に移す
		//**********************************************
		//@called processKey
		function nextLine() {
			var obj = getCurrentLine();
			if (!obj) {
				var idx = -1;
			} else {
				var idx = $(Elem.results).children('li').index(obj);
				$(obj).removeClass(Cls.select);
			}
			idx++;
			if (idx < $(Elem.results).children('li').length) {
				var next = $(Elem.results).children('li').eq(idx);
				setSubInfo(next);
				$(next).addClass(Cls.select);
				cssFocusResults();
			} else {
				cssFocusInput();
			}
			//選択候補を追いかけてスクロール
			scrollWindow();
		}
		//**********************************************
		//選択候補を前に移す
		//**********************************************
		//@called processKey
		function prevLine() {
			var obj = getCurrentLine();
			if (!obj) {
				var idx = $(Elem.results).children('li').length;
			} else {
				var idx = $(Elem.results).children('li').index(obj);
				$(obj).removeClass(Cls.select);
			}
			idx--;
			if (idx > -1) {
				var prev = $(Elem.results).children('li').eq(idx);
				setSubInfo(prev);
				$(prev).addClass(Cls.select);
				cssFocusResults();
			} else {
				cssFocusInput();
			}
			//選択候補を追いかけてスクロール
			scrollWindow();
		}
	} //the end of "individual"
})(jQuery);
