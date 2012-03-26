/*
Infomation
==========================================================================================
jQuery Plugin
	Name       : jquery.ajaxComboBox
	Version    : 5.0
	Update     : 2012-03-15
	Author     : Yuusaku Miyazaki (宮崎 雄策) (toumin.m7@gmail.com)
	Author-URI : http://d.hatena.ne.jp/sutara_lumpur/20090124/1232781879
	License    : MIT License (http://www.opensource.org/licenses/mit-license.php)
	Based-on   : This plug-in uses code and techniques from following libraries.
		* jquery.suggest 1.1
			Author     : Peter Vulgaris
			Author-URI : http://www.vulgarisoip.com/
			
		* jquery.caretpos.js 0.1
			Author     : tubureteru
			Author-URI : http://d.hatena.ne.jp/tubureteru/
			License    : MIT License (http://www.opensource.org/licenses/mit-license.php)
==========================================================================================

Index
==========================================================================================
#1. Global vars
	initOptions
	initMessages
	initCssClassName
	initLocalVars
	initElements

#2. Initialize HTML-elements
	
#3. Event handler
==========================================================================================
*/
(function($) {
	//Start point
	$.fn.ajaxComboBox = function(_source, _options) {
		//Return jQuery object to continue method chain.
		return this.each(function() {
			individual(this, _source, _options);
		});
	};
	//Individual
	function individual(_jqobj, _source, _options) {
		//#1. Global vars
		var Opt  = initOptions(_source, _options); //options of plugin
		var Msg  = initMessages();                 //"title attr" for each languages
		var Cls  = initCssClassName();
		var Vars = initLocalVars();
		var Elem = initElements(_jqobj);

		//#2. Initialize HTML-elements
		$.ajaxSetup({cache: false}); //disable the cache of Ajax
		btnAttrDefault();            //initialize the "get all" button 
		setInitVal();                //set initial value to ComboBox

		//#3. Event handler
		eHandlerForButton(); //"get all" button
		eHandlerForInput();  //text-box
		eHandlerForWhole();  //plugin whole
		
		//It is completion now.
		return true;

		//============================================================
		//#1.Global vars
		//============================================================
		//************************************************************
		//Initialize options of plugin
		//************************************************************
		//@called individual
		//@params obj,str _source  (the name of file for DB connect, or JSON object)
		//@params obj     _options (options sent by user)
		//@return obj
		function initOptions(_source, _options) {
			//----------------------------------------
			// first
			//----------------------------------------
			_options = $.extend({
				//基本設定
				source         : _source,
				plugin_type    : 'combobox',
				db_table       : 'tbl',                    //table for DB connect
				field          : 'name',                   //column for display as suggest
				img_dir        : 'acbox/img/',             //path to image of button
				and_or         : 'AND',                    //AND? OR? for search words
				per_page       : 10,                       //候補一覧1ページに表示する件数
				navi_num       : 5,                        //ページナビで表示するページ番号の数
				navi_simple    : false,                    //先頭、末尾のページへのリンクを表示するか？
				init_val       : false,                    //ComboBoxの初期値(配列形式で渡す)
				init_src       : 'acbox/php/initval.php', //廃止予定 &&& //初期値設定問い合わせURL
				lang           : 'ja',                     //言語を選択(デフォルトは日本語)
				bind_to        : false,                    //候補選択後に実行されるイベントの名前
			
				//サブ情報
				sub_info       : false, //サブ情報を表示するかどうか？ !!! true, false, 'simple'
				sub_as         : {},    //サブ情報での、カラム名の別名
				show_field     : '',    //サブ情報で表示するカラム(複数指定はカンマ区切り)
				hide_field     : '',    //サブ情報で非表示にするカラム(複数指定はカンマ区切り)

				//セレクト専用
				select_only    : false, //セレクト専用にするかどうか？
				primary_key    : 'id',  //セレクト専用時、hiddenの値となるカラム
			}, _options);
		
			//----------------------------------------
			// second(他のオプションの値を引用するため)
			//----------------------------------------
			_options = $.extend({
				search_field : _options.field, //検索するフィールド(カンマ区切りで複数指定可能)
				order_field  : _options.field, //ORDER BY(SQL) の基準となるカラム名(カンマ区切り複数指定)
				order_by     : 'ASC',          //ORDER BY(SQL) で、並ベ替えるのは昇順か降順か

				//画像
				button_img   : _options.img_dir + 'combobox_button' + '.png'
			}, _options);

			return _options;
		}
		//************************************************************
		//"title attr" for each languages
		//************************************************************
		//@called individual
		//@global obj Opt (use not only "Opt.lang", but "per_page" and others)
		//@return obj
		function initMessages() {
			switch (Opt.lang) {
				//English
				case 'en':
					return {
						'add_btn'     : 'Add button',
						'add_title'   : 'add a box',
						'del_btn'     : 'Del button',
						'del_title'   : 'delete a box',
						'next'        : 'Next',
						'next_title'  : 'Next' + Opt.per_page + ' (Right key)',
						'prev'        : 'Prev',
						'prev_title'  : 'Prev' + Opt.per_page + ' (Left key)',
						'first_title' : 'First (Shift + Left key)',
						'last_title'  : 'Last (Shift + Right key)',
						'get_all_btn' : 'Get All (Down key)',
						'get_all_alt' : '(button)',
						'close_btn'   : 'Close (Tab key)',
						'close_alt'   : '(button)',
						'loading'     : 'loading...',
						'loading_alt' : '(loading)',
						'page_info'   : 'num_page_top - num_page_end of cnt',
						'select_ng'   : 'Attention : Please choose from among the list.',
						'select_ok'   : 'OK : Correctly selected.',
						'not_found'   : 'not found'
					};
					break;

				//Spanish (Thanks Joaquin G. de la Zerda)
				case 'es':
					return {
						'add_btn'     : 'Agregar boton',
						'add_title'   : 'Agregar una opcion',
						'del_btn'     : 'Borrar boton',
						'del_title'   : 'Borrar una opcion',
						'next'        : 'Siguiente',
						'next_title'  : 'Proximas ' + Opt.per_page + ' (tecla derecha)',
						'prev'        : 'Anterior',
						'prev_title'  : 'Anteriores ' + Opt.per_page + ' (tecla izquierda)',
						'first_title' : 'Primera (Shift + Left)',
						'last_title'  : 'Ultima (Shift + Right)',
						'get_all_btn' : 'Ver todos (tecla abajo)',
						'get_all_alt' : '(boton)',
						'close_btn'   : 'Cerrar (tecla TAB)',
						'close_alt'   : '(boton)',
						'loading'     : 'Cargando...',
						'loading_alt' : '(Cargando)',
						'page_info'   : 'num_page_top - num_page_end de cnt',
						'select_ng'   : 'Atencion: Elija una opcion de la lista.',
						'select_ok'   : 'OK: Correctamente seleccionado.',
						'not_found'   : 'no encuentre'
					};
					break;
		
				//Japanese
				default:
					return {
						'add_btn'     : '追加ボタン',
						'add_title'   : '入力ボックスを追加します',
						'del_btn'     : '削除ボタン',
						'del_title'   : '入力ボックスを削除します',
						'next'        : '次へ',
						'next_title'  : '次の' + Opt.per_page + '件 (右キー)',
						'prev'        : '前へ',
						'prev_title'  : '前の' + Opt.per_page + '件 (左キー)',
						'first_title' : '最初のページへ (Shift + 左キー)',
						'last_title'  : '最後のページへ (Shift + 右キー)',
						'get_all_btn' : '全件取得 (下キー)',
						'get_all_alt' : '画像:ボタン',
						'close_btn'   : '閉じる (Tabキー)',
						'close_alt'   : '画像:ボタン',
						'loading'     : '読み込み中...',
						'loading_alt' : '画像:読み込み中...',
						'page_info'   : 'num_page_top - num_page_end 件 (全 cnt 件)',
						'select_ng'   : '注意 : リストの中から選択してください',
						'select_ok'   : 'OK : 正しく選択されました。',
						'not_found'   : '(0 件)'
					};
			}
		}
		//************************************************************
		// Set name of CSS class.
		//************************************************************
		//@called individual
		//@global obj Opt オプション
		//@return obj         クラス名の詰め合わせ
		function initCssClassName() {
			//各モード共通
			var class_name = {
				container      : 'ac_container', //ComboBoxを包むdivタグ
				container_open : 'ac_container_open'
			};
			switch (Opt.plugin_type) {
				//コンボボックス
				case 'combobox':
					class_name = $.extend(class_name, {
						'input'     : 'ac_input', //テキストボックス
						'input_off' : 'ac_input_off', //テキストボックス(非選択状態)
						'button'    : 'ac_button', //ボタンのCSSクラス
						'btn_on'    : 'ac_btn_on', //ボタン(mover時)
						'btn_out'   : 'ac_btn_out', //ボタン(mout時)
						're_area'   : 'ac_result_area', //結果リストの<div>
						'navi'      : 'ac_navi', //ページナビを囲む<div>
						'results'   : 'ac_results', //候補一覧を囲む<ul>
						're_off'    : 'ac_results_off', //候補一覧(非選択状態)
						'select'    : 'ac_over', //選択中の<li>
						'sub_info'  : 'ac_attached', //サブ情報
						'select_ok' : 'ac_select_ok',
						'select_ng' : 'ac_select_ng'
					});
					break;
			
				case 'simple':
					class_name = $.extend(class_name, {
						'input'     : 'ac_s_input', //テキストボックス
						'input_off' : 'ac_s_input_off', //テキストボックス(非選択状態)
						'button'    : 'ac_s_button', //ボタンのCSSクラス
						'btn_on'    : 'ac_s_btn_on', //ボタン(mover時)
						'btn_out'   : 'ac_s_btn_out', //ボタン(mout時)
						're_area'   : 'ac_result_area', //結果リストの<div>
						'navi'      : 'ac_navi', //ページナビを囲む<div>
						'results'   : 'ac_results', //候補一覧を囲む<ul>
						're_off'    : 'ac_results_off', //候補一覧(非選択状態)
						'select'    : 'ac_over', //選択中の<li>
						'sub_info'  : 'ac_attached', //サブ情報
						'select_ok' : 'ac_select_ok',
						'select_ng' : 'ac_select_ng'
					});
					break;
				
					
			}
			return class_name;
		}
		//**********************************************
		// Initialize vars
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
				is_paging       : false, //ページ移動か?(MoveToSameLineに影響)
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
				size_left       : null   //サブ情報表示用(リストの横幅)
			};
			if(Opt.sub_info){
				//サブ情報表示の場合に取得するカラム
				if(Opt.show_field && !Opt.hide_field){
					localvars.select_field = Opt.field + ',' + Opt.show_field;
				} else {
					localvars.select_field = '*';
				}
			} else {
				localvars.select_field = Opt.field;
				Opt.hide_field = '';
			}
			if(Opt.select_only && localvars.select_field != '*'){
				localvars.select_field += ',' + Opt.primary_key;
			}

			//セレクト専用時、フォーム送信する一意の情報を格納する
			localvars.primarykey = (Opt.select_only)
				? Opt.primary_key
				: '';

			return localvars;
		}
		//**********************************************
		// Initialize HTML-elements 
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
			elems.button    = $('<div>').addClass(Cls.button);
			elems.img       = $('<img>').attr('src', Opt.button_img);
			elems.clear     = $('<div>').css('clear', 'left');

			//サジェストリスト
			elems.result_area = $('<div>').addClass(Cls.re_area);
			elems.navi        = $('<div>').addClass(Cls.navi);
			elems.navi_info   = $('<div>').addClass('info');
			elems.navi_p      = $('<p>');
			elems.results     = $('<ul>' ).addClass(Cls.results);
			elems.sub_info    = $('<div>').addClass(Cls.sub_info);
			//$(elems.container).after($(elems.result_area)); &&& 2012年2月13日 構造を変更した

			//"セレクト専用"オプション用
			elems.hidden = $('<input type="hidden" />')
				.attr({
					'name': $(elems.combo_input).attr('name'),
					'id'  : $(elems.combo_input).attr('name') + '_hidden'
				})
				.val('');

			//----------------------------------------------
			//部品をページに配置
			//----------------------------------------------
			$(elems.container)
				.append(elems.button)
				.append(elems.clear)
				.append(elems.result_area)
				.append(elems.hidden);

			$(elems.button).append(elems.img);
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
			$(elems.container).width(
				$(elems.combo_input).outerWidth() + $(elems.button).outerWidth()
			);
			//ボタンの高さ
			$(elems.button).height(
				$(elems.combo_input).innerHeight()
			);
			//候補リストの幅とトップ位置
			$(elems.result_area)
				.width(
					$(elems.container).width() -
					($(elems.result_area).outerWidth() - $(elems.result_area).innerWidth())
				)
				.css({
					'top':$(elems.container).outerHeight() + $(elems.container).offset().top
				});

			return elems;
		}
		//============================================================
		//#2. 部品、処理の初期設定
		//============================================================
		//**********************************************
		//initialize "title attr" of button
		//**********************************************
		//@called individual
		function btnAttrDefault() {
			if(Opt.select_only){
				if($(Elem.combo_input).val() != ''){
					if($(Elem.hidden).val() != ''){
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
				} else {
					//完全な初期状態へ戻す
					$(Elem.hidden).val('');
					$(Elem.combo_input)
						.removeAttr('title')
						.removeClass(Cls.select_ng)
				}
			}
			//初期状態
			$(Elem.button).attr('title', Msg.get_all_btn);
			$(Elem.img).attr('src', Opt.button_img);

			btnPositionAdjust();
		}
		//**********************************************
		//ボタンの画像の位置を調整する
		//**********************************************
		//@called btnAttrDefault
		function btnPositionAdjust(){
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
		function setInitVal() {
			if(Opt.init_val === false) return;

			if(Opt.select_only){
				//------------------------------------------
				//セレクト専用への値挿入
				//------------------------------------------
				//hiddenへ値を挿入
				var q_word = Opt.init_val;
				$(Elem.hidden).val(q_word);

				//テキストボックスへ値を挿入
				var init_val_data = '';
				if(typeof Opt.source == 'object'){
					//sourceがデータセットの場合
					for(var i=0; i<Opt.source.length; i++){
						if(Opt.source[i][Opt.primary_key] == q_word){
							var data = Opt.source[i][Opt.field];
							break;
						}
					}
					_afterInit(data);
				}else{
					$.get(
						Opt.init_src,
						{
							'q_word'      : q_word,
							'field'       : Opt.field,
							'primary_key' : Opt.primary_key,
							'db_table'    : Opt.db_table
						},
						function(data){ _afterInit(data) }
					);
				}
			} else {
				//------------------------------------------
				//通常の、テキストボックスへの値挿入
				//------------------------------------------
				$(Elem.combo_input).val(Opt.init_val);
				Vars.prev_value = Opt.init_val;
			}
			//------------------------------------------
			//初期化用Ajax後の処理
			//------------------------------------------
			function _afterInit(data){
				$(Elem.combo_input).val(data);

				//選択状態
				$(Elem.combo_input)
					.attr('title',Msg.select_ok)
					.removeClass(Cls.select_ng)
					.addClass(Cls.select_ok);
			
				Vars.prev_value = data;
			}
		}
		//============================================================
		//#3. Event handler
		//============================================================
		//************************************************************
		//"get all" button
		//************************************************************
		//@called individual
		function eHandlerForButton() {
			$(Elem.button)
				.mouseup(function(ev) {
					if($(Elem.result_area).css('display') == 'none') {
						clearInterval(Vars.timer_valchange);
			
						Vars.is_suggest = false;
						suggest();
						$(Elem.combo_input).focus();
					} else {
						hideResult();
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
			if(window.opera){
				//for Opera
				$(Elem.combo_input).keypress(processKey);
			}else{
				//others
				$(Elem.combo_input).keydown(processKey);
			}
			$(Elem.combo_input)
				.focus(function() { setTimerCheckValue() })
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
				else hideResult();
			});
		}
		//**********************************************
		//list of suggests
		//**********************************************
		//@called displayItems
		function EH_results() {
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
					selectCurrentResult(false);
				});
		}
		//**********************************************
		//paging of results
		//**********************************************
		//@called setNavi
		function EH_navi_paging() {
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

				if(!Vars.is_suggest) Vars.page_all     = parseInt($(this).text(), 10);
				else                 Vars.page_suggest = parseInt($(this).text(), 10);

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
		//================================================================================
		//#3_1. button
		//--------------------------------------------------------------------------------
		//**********************************************
		//image for loading
		//**********************************************
		function setLoadImg() {
			$(Elem.navi_info).text(Msg.loading);
			if ($(Elem.results).children('dl').is(':hidden')) {
				$(Elem.results).empty();
				$(Elem.sub_info).empty();
				$(Elem.result_area).show();
				$(Elem.container).addClass(Cls.container_open);
			}
		}
		//================================================================================
		//05.未分類
		//--------------------------------------------------------------------------------
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
			var $current_result = getCurrentResult();

			var target_top = ($current_result && !enforce)
				? $current_result.offset().top
				: $(Elem.container).offset().top;

			var target_size;

			if(Opt.sub_info){
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
			if ($current_result.length) {
				if(target_top < scroll_top || target_size > client_height) {
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
			if(now_value != Vars.prev_value) {
				Vars.prev_value = now_value;
				//sub_info属性を削除
				$(Elem.combo_input).removeAttr('sub_info');

				//セレクト専用時
				if(Opt.select_only){
					$(Elem.hidden).val('');
					btnAttrDefault();
				}
				//ページ数をリセット
				Vars.page_suggest = 1;
			
				Vars.is_suggest = true;
				suggest();
			}
			//一定時間ごとの監視を再開
			setTimerCheckValue();
		}
		//**********************************************
		//キー入力への対応
		//**********************************************
		function processKey(e) {
			if (
				($.inArray(e.keyCode, [27,38,40,9]) > -1 && $(Elem.result_area).is(':visible')) ||
				($.inArray(e.keyCode, [37,39,13,9]) > -1 && getCurrentResult()) ||
				e.keyCode == 40
			) {
				if (e.preventDefault)  e.preventDefault();
				if (e.stopPropagation) e.stopPropagation();

				e.cancelBubble = true;
				e.returnValue  = false;

				switch(e.keyCode) {
					case 37: // left
						if (e.shiftKey) firstPage();
						else            prevPage();
						break;

					case 38: // up
						Vars.key_select = true;
						prevResult();
						break;

					case 39: // right
						if (e.shiftKey) lastPage();
						else            nextPage();
						break;

					case 40: // down
						if ($(Elem.results).children('li').length){
							Vars.key_select = true;
							nextResult();
						} else {
							Vars.is_suggest = false;
							suggest();
						}
						break;

					case 9:  // tab
						Vars.key_paging = true;
						hideResult();
						break;

					case 13: // return
						selectCurrentResult(true);
						break;

					case 27: //	escape
						Vars.key_paging = true;
						hideResult();
						break;
				}

			} else {
				if (e.keyCode != 16) cssFocusInput(); //except Shift(16)
				checkValue();
			}
		}

		//================================================================================
		//06.Ajax
		//--------------------------------------------------------------------------------
		//**********************************************
		//abort Ajax
		//**********************************************
		function abortAjax() {
			if (Vars.xhr){
				Vars.xhr.abort();
				Vars.xhr = false;
			}
		}
		//**********************************************
		//send request to PHP(server side)
		//**********************************************
		function suggest() {		
			var q_word = (Vars.is_suggest) ? $.trim($(Elem.combo_input).val()) : '';
			if (q_word.length < 1 && Vars.is_suggest) {
				hideResult();
				return;
			}


			abortAjax(); //Ajax通信をキャンセル
			setLoadImg(); //ローディング表示
			$(Elem.sub_info).children('dl').hide(); //サブ情報消去

			//ここで、本来は真偽値が格納される変数に数値を格納している。
			if      (Vars.is_paging)   Vars.is_paging = getCurrentLine();
			else if (!Vars.is_suggest) Vars.is_paging = 0;

			var which_page_num = (Vars.is_suggest) ? Vars.page_suggest : Vars.page_all;
			//データ取得
			if(typeof Opt.source == 'object'){
				//sourceがデータセットの場合
				searchInsteadOfDB(q_word, which_page_num);
			}else{
				//ここでAjax通信を行っている
				Vars.xhr = $.getJSON(
					Opt.source,
					{
						'q_word'       : q_word,
						'page_num'     : which_page_num,
						'per_page'     : Opt.per_page,
						'field'        : Opt.field,
						'search_field' : Opt.search_field,
						'and_or'       : Opt.and_or,
						'show_field'   : Opt.show_field,
						'hide_field'   : Opt.hide_field,
						'select_field' : Vars.select_field,
						'order_field'  : Opt.order_field,
						'order_by'     : Opt.order_by,
						'primary_key'  : Vars.primarykey,
						'db_table'     : Opt.db_table
					},
					function(json_data){
						Vars.xhr = null;
						afterAjax(json_data, q_word, which_page_num);
					}
				);
			}
		}
		//**********************************************
		//データベースではなく、JSONを検索
		//**********************************************
		function searchInsteadOfDB(q_word, which_page_num){
			//正規表現のメタ文字をエスケープ
			var escaped_q = q_word.replace(/\W/g,'\\$&');
			escaped_q = escaped_q.toString();
	
			//SELECT * FROM source WHERE field LIKE q_word;
			var matched = [];
			var reg     = new RegExp(escaped_q, 'gi');
			for (var k in Opt.source) {
				if (Opt.source[k][Opt.field].match(reg)) {
					matched.push(Opt.source[k]);
				}
			}
			var json_data = {};
			json_data['cnt'] = matched.length;
			if(!json_data['cnt']){
				json_data['candidate'] = false;

			}else{

				//ORDER BY (CASE WHEN ...), order_field ASC (or DESC)
				var matched1 = [];
				var matched2 = [];
				var matched3 = [];
				var reg1 = new RegExp('^' + escaped_q + '$', 'gi');
				var reg2 = new RegExp('^' + escaped_q, 'gi');
				for (var k in matched) {
					if(matched[k][Opt.order_field].match(reg1)){
						matched1.push(matched[k]);
					}else if(matched[k][Opt.order_field].match(reg2)){
						matched2.push(matched[k]);
					}else{
						matched3.push(matched[k]);
					}
				}
				if(Opt.order_by == 'ASC'){
					matched1.sort(compareASC);
					matched2.sort(compareASC);
					matched3.sort(compareASC);
				}else{
					matched1.sort(compareDESC);
					matched2.sort(compareDESC);
					matched3.sort(compareDESC);
				}
				var sorted = matched1.concat(matched2);
				sorted = sorted.concat(matched3);
			
				//LIMIT xx OFFSET xx
				var start = (which_page_num - 1) * Opt.per_page;
				var end   = start + Opt.per_page;
			
				//----------------------------------------------
				//最終的に返るオブジェクトを作成
				//----------------------------------------------
				var show_field = Opt.show_field.split(',');
				var hide_field = Opt.hide_field.split(',');
				for(var i = start, sub = 0; i < end; i++, sub++){
					if(sorted[i] == undefined) break;
			
					for(var key in sorted[i]){
						//セレクト専用
						if(key == Vars.primarykey){
							if(json_data['primary_key'] == undefined){
								json_data['primary_key'] = [];
							}
							json_data['primary_key'].push(sorted[i][key]);
						}
				
						if(key == Opt.field){
							//変換候補を取得
							if(json_data['candidate'] == undefined){
								json_data['candidate'] = [];
							}
							json_data['candidate'].push(sorted[i][key]);
						} else {
							//サブ情報
							if($.inArray(key, hide_field) == -1){
								if(
									show_field !== false
									&& !$.inArray('*', show_field) > -1
									&& !$.inArray(key, show_field)
								){
									continue;
								}
								if(json_data['attached'] == undefined){
									json_data['attached'] = [];
								}
								if(json_data['attached'][sub] == undefined){
									json_data['attached'][sub] = [];
								}
								json_data['attached'][sub].push([key, sorted[i][key]]);
							}
						}
					}
				}
				json_data['cnt_page'] = json_data['candidate'].length;
			}
			afterAjax(json_data, q_word, which_page_num);
		}
		//**********************************************
		//searchInsteadOfDB内のsort用の比較関数
		//**********************************************
		function compareASC(a, b){
			return a[Opt.order_field].localeCompare(b[Opt.order_field]);
		}
		function compareDESC(a, b){
			return b[Opt.order_field].localeCompare(a[Opt.order_field]);
		}
		//**********************************************
		//問い合わせ後の処理
		//**********************************************
		//DB, JSONで分岐していた処理が、ここで合流する。
		function afterAjax(json_data, q_word, which_page_num){
			if(!json_data.candidate){
				//一致するデータ見つからなかった
				//hideResult();
				$(Elem.navi_info).text(Msg.not_found);
				$(Elem.navi_p).hide();
				$(Elem.results).empty();
				$(Elem.sub_info).empty();
				$(Elem.result_area).show();
				$(Elem.container).addClass(Cls.container_open);
			} else {
				//1ページのみでもナビを表示する
				setNavi(json_data.cnt, json_data.cnt_page, which_page_num);
				/* 
				//全件数が1ページ最大数を超えない場合、ページナビは非表示
				if(json_data.cnt > json_data.cnt_page){
					setNavi(json_data.cnt, json_data.cnt_page, which_page_num);
				} else {
					$(Elem.navi).hide();
				}
				*/

				//候補リスト(arr_candidate)
				var arr_candidate = json_data.candidate;
			
				//サブ情報(arr_attached)
				var arr_attached = [];
				if(json_data.attached  && Opt.sub_info){
					$.each(json_data.attached,function(i,obj){
						arr_attached[i] = obj;
					});
				} else {
					arr_attached = false;
				}

				//セレクト専用(arr_primary_key)
				var arr_primary_key = [];
				if(json_data.primary_key){
					$.each(json_data.primary_key,function(i,obj){
						arr_primary_key[i] = obj;
					});
				} else {
					arr_primary_key = false;
				}
			
				//セレクト専用時
				//本来なら、候補リストから選ばなければならないが、
				//候補の数が一つで、その候補の文字列と入力文字列が一致する場合、
				//『リストから選ばれた』と判断する。
				if (
					Opt.select_only &&
					arr_candidate.length === 1 &&
					arr_candidate[0] == q_word
				) {
					$(Elem.hidden).val(arr_primary_key[0]);
					btnAttrDefault();
				}					
				//候補リストを表示する
				displayItems(arr_candidate, arr_attached, arr_primary_key);
			}
			if (Vars.is_paging === false) {
				cssFocusInput();
			} else {
				MoveToSameLine();
				cssFocusResults();
			}
		}
		//================================================================================
		//07.ページナビ
		//--------------------------------------------------------------------------------
		//**********************************************
		//ナビ部分を作成
		//**********************************************
		// @param integer cnt         DBから取得した候補の数
		// @param integer page_num    全件、または予測候補の一覧のページ数
		function setNavi(cnt, cnt_page, page_num) {

			var num_page_top = Opt.per_page * (page_num - 1) + 1;
			var num_page_end = num_page_top + cnt_page - 1;

			var cnt_result = Msg['page_info']
				.replace('cnt'          , cnt)
				.replace('num_page_top' , num_page_top)
				.replace('num_page_end' , num_page_end);

			$(Elem.navi_info).text(cnt_result);

			//----------------------------------------------
			//ページング部分
			//----------------------------------------------
			var max = Math.ceil(cnt / Opt.per_page); //全ページ数
			if (max > 1) {
				$(Elem.navi_p).empty();
				//ページ数
				if (Vars.is_suggest) {
					Vars.max_suggest = max;
				}else{
					Vars.max_all = max;
				}

				//表示する一連のページ番号の左右端
				var left  = page_num - Math.ceil ((Opt.navi_num - 1) / 2);
				var right = page_num + Math.floor((Opt.navi_num - 1) / 2);

				//現ページが端近くの場合のleft,rightの調整
				while(left < 1){ left ++;right++; }
				while(right > max){ right--; }
				while((right-left < Opt.navi_num - 1) && left > 1){ left--; }

				//『<< 前へ』の表示
				if(page_num == 1) {
					if(!Opt.navi_simple){
						$('<span></span>')
							.text('<< 1')
							.addClass('page_end')
							.appendTo(Elem.navi_p);
					}
					$('<span></span>')
						.text(Msg['prev'])
						.addClass('page_end')
						.appendTo(Elem.navi_p);
				} else {
					if(!Opt.navi_simple){
						$('<a></a>')
							.attr({'href':'javascript:void(0)','class':'navi_first'})
							.text('<< 1')
							.attr('title', Msg['first_title'])
							.appendTo(Elem.navi_p);
					}
					$('<a></a>')
						.attr({'href':'javascript:void(0)','class':'navi_prev'})
						.text(Msg['prev'])
						.attr('title', Msg['prev_title'])
						.appendTo(Elem.navi_p);
				}

				//各ページへのリンクの表示
				for (i = left; i <= right; i++)
				{
					//現在のページ番号は<span>で囲む(強調表示用)
					var num_link = (i == page_num) ? '<span class="current">'+i+'</span>' : i;

					$('<a></a>')
						.attr({'href':'javascript:void(0)','class':'navi_page'})
						.html(num_link)
						.appendTo(Elem.navi_p);
				}

				//『次のX件 >>』の表示
				if(page_num == max) {
					$('<span></span>')
						.text(Msg['next'])
						.addClass('page_end')
						.appendTo(Elem.navi_p);
					if(!Opt.navi_simple){
						$('<span></span>')
							.text(max + ' >>')
							.addClass('page_end')
							.appendTo(Elem.navi_p);
					}
				} else {
					$('<a></a>')
						.attr({'href':'javascript:void(0)','class':'navi_next'})
						.text(Msg['next'])
						.attr('title', Msg['next_title'])
						.appendTo(Elem.navi_p);
					if(!Opt.navi_simple){
						$('<a></a>')
							.attr({'href':'javascript:void(0)','class':'navi_last'})
							.text(max + ' >>')
							.attr('title', Msg['last_title'])
							.appendTo(Elem.navi_p);
					}
				}
				$(Elem.navi_p).show();
				EH_navi_paging(); //イベントハンドラ設定
			} else {
				$(Elem.navi_p).hide();
			}
		}
		//**********************************************
		//1ページ目へ
		//**********************************************
		function firstPage() {
			if(!Vars.is_suggest) {
				if (Vars.page_all > 1) {
					Vars.page_all = 1;
					Vars.is_paging = true;
					suggest();
				}
			}else{
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
		function prevPage() {
			if(!Vars.is_suggest){
				if (Vars.page_all > 1) {
					Vars.page_all--;
					Vars.is_paging = true;
					suggest();
				}
			}else{
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
		function nextPage() {
			if(Vars.is_suggest){
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
		function lastPage() {
			if(!Vars.is_suggest){
				if (Vars.page_all < Vars.max_all) {
					Vars.page_all = Vars.max_all;
					Vars.is_paging = true;
					suggest();
				}
			}else{
				if (Vars.page_suggest < Vars.max_suggest) {
					Vars.page_suggest = Vars.max_suggest;
					Vars.is_paging = true;
					suggest();
				}
			}
		}
		//08. 候補
		//************************************************************
		//候補一覧の<ul>成形、表示
		//************************************************************
		// @params array arr_candidate   DBから検索・取得した値の配列
		// @params array arr_attached    サブ情報の配列
		// @params array arr_primary_key 主キーの配列
		//
		//arr_candidateそれぞれの値を<li>で囲んで表示。
		//同時に、イベントハンドラを記述。
		function displayItems(arr_candidate, arr_attached, arr_primary_key) {

			//候補リストを、一旦リセット
			$(Elem.results).empty();
			$(Elem.sub_info).empty();
			for (var i = 0; i < arr_candidate.length; i++) {

				//候補リスト
				var $li = $('<li>').text(arr_candidate[i]); //!!! against XSS !!!
			
				//セレクト専用
				if(Opt.select_only){
					$li.attr('id', arr_primary_key[i]);
				}

				$(Elem.results).append($li);

				//サブ情報のdlを生成
				if(arr_attached){
					//sub_info属性にJSON文字列そのままを格納
					var json_subinfo = '{';
					var $dl = $('<dl>');
					//テーブルの各行を生成
					for (var j=0; j < arr_attached[i].length; j++) {
						//sub_info属性の値を整える
						var json_key = arr_attached[i][j][0].replace('\'', '\\\'');
						var json_val = arr_attached[i][j][1].replace('\'', '\\\'');
						json_subinfo += "'" + json_key + "':" + "'" + json_val + "'";
						if((j+1) < arr_attached[i].length) json_subinfo += ',';

						//thの別名を検索する
						if(Opt.sub_as[arr_attached[i][j][0]] != null){
							var dt = Opt.sub_as[arr_attached[i][j][0]];
						} else {
							var dt =  arr_attached[i][j][0];
						}
						dt = $('<dt>').text(dt); //!!! against XSS !!!
						if(Opt.sub_info == 'simple') $(dt).addClass('hide'); //シンプル用!!!
						$dl.append(dt);
					
						var dd = $('<dd>').text(arr_attached[i][j][1]);	//!!! against XSS !!!
						$dl.append(dd);
					}
					//sub_info属性を候補リストのliに追加
					json_subinfo += '}';
					$li.attr('sub_info', json_subinfo);
					$(Elem.sub_info).append($dl);
				}
			}

			//サジェスト結果表示
			$(Elem.result_area).show();
			$(Elem.container).addClass(Cls.container_open);

			EH_results(); //イベントハンドラ設定
			
			//ボタンのtitle属性変更(閉じる)
			$(Elem.button).attr('title',Msg['close_btn']);
		}

		//**********************************************
		//現在選択中の候補に決定する
		//**********************************************
		function selectCurrentResult(is_enter_key) {

			//選択候補を追いかけてスクロール
			scrollWindow(true);

			var current = getCurrentResult();

			if (current) {
				$(Elem.combo_input).val($(current).text());
				//サブ情報があるならsub_info属性を追加・書き換え
				if(Opt.sub_info) {
					$(Elem.combo_input).attr('sub_info', $(current).attr('sub_info'));
				}
				hideResult();

				//added
				Vars.prev_value = $(Elem.combo_input).val();

				//セレクト専用
				if(Opt.select_only){
					$(Elem.hidden).val($(current).attr('id'));
					btnAttrDefault();
				}
			}
			if(Opt.bind_to){
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
		function getCurrentResult() {
			if ($(Elem.result_area).is(':hidden')) return false;
			var obj = $(Elem.results).children('li.' + Cls.select);
			if ($(obj).length) return obj;
			else return false;
		}
		//**********************************************
		//現在行の番号を取得
		//**********************************************
		function getCurrentLine() {
			var obj = $(Elem.results).children('li.' + Cls.select);
			if (!obj.length) return -1;			
			return $(Elem.results).children('li').index(obj);
		}
		//**********************************************
		//選択候補を次に移す
		//**********************************************
		function nextResult() {
			var idx = getCurrentLine();
			if (idx > -1) {
				$(Elem.results).children('li').eq(idx).removeClass(Cls.select);
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
		function prevResult() {
			var idx = getCurrentLine();
			if (idx > -1) {
				$(Elem.results).children('li').eq(idx).removeClass(Cls.select);
			} else {
				idx = $(Elem.results).children('li').length;
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
		//**********************************************
		//候補リストを暗く、入力欄を明瞭に
		//サブ情報は隠す
		//**********************************************
		//@called nextResult, prevResult, afterAjax, selectCurrentResult, 
		//@called processKey, hideResult, EH_input
		function cssFocusInput() {
			$(Elem.results).addClass(Cls.re_off);
			$(Elem.combo_input).removeClass(Cls.input_off);
			$(Elem.sub_info).children('dl').hide();
		}
		//**********************************************
		//候補リストを明瞭に、入力欄を暗く
		//**********************************************
		//@called nextResult, prevResult, afterAjax, EH_results
		function cssFocusResults() {
			$(Elem.results).removeClass(Cls.re_off);
			$(Elem.combo_input).addClass(Cls.input_off);
		}
		//**********************************************
		//候補エリアを消去
		//**********************************************
		function hideResult() {
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
		//**********************************************
		//全件表示とページ移動時、直前の行番号と同じ候補を選択状態にする
		//**********************************************
		function MoveToSameLine(){
			var idx = Vars.is_paging; //真偽値を収めるべき変数に、例外的に数値が入っている。
			var limit = $(Elem.results).children('li').length - 1;
			if (idx > limit) idx = limit;
			var obj = $(Elem.results).children('li').eq(idx);
			
			$(obj).addClass(Cls.select);
			setSubInfo(obj);

			Vars.is_paging = false; //次回に備えて初期化する
		}
		//================================================================================
		//09.サブ情報
		//--------------------------------------------------------------------------------
		//**********************************************
		//サブ情報を表示する
		//**********************************************
		// @paramas object  obj   サブ情報を右隣に表示させる<li>要素
		function setSubInfo(obj){
			//サブ情報を表示しない設定なら、ここで終了
			if(!Opt.sub_info) return; 

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
			if($(Elem.navi).css('display') != 'none') t_top += Vars.size_navi;
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
	} //the end of "individual"
})(jQuery);
