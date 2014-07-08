/**
 * @file jQuery Plugin: jquery.simpleScrollFollow
 * @version 2.0
 * @author Yuusaku Miyazaki [toumin.m7@gmail.com]
 * @license MIT License
 */
(function($) {

/**
 * @desc プラグインをjQueryのプロトタイプに追加する
 * @global
 * @memberof jQuery
 * @param {Object} [option] オプションを格納した連想配列
 * @param {boolean|undefined} [option.instance=undefined] - プラグインを呼び出すとき、jQueryオブジェクトではなく、インスタンスを返すかどうかの真偽値
 * @param {boolean} [option.enabled=true] - スクロールを有効にするかどうかの真偽値
 * @param {Object|string} [option.limit_elem='window'] - 追尾要素のスクロールの下限の基準となる要素のjQueryオブジェクト、またはセレクタ文字列
 * @param {number} [option.min_width=0] - 追尾スクロールを有効にする最低限の画面幅
 * @return {Object|Array} - jQueryオブジェクト、または、インスタンスを返すオプションが有効な場合はインスタンスの配列
 */
$.fn.simpleScrollFollow = function(option) {
	var arr = [];
	this.each(function() {
		arr.push(new SimpleScrollFollow(this, option));
	});
	return (option != undefined && option.instance != undefined && option.instance) ? $(arr) : this;
};

/**
 * @global
 * @constructor
 * @classdesc 要素ごとに適用される処理を集めたクラス
 * @param {Object} elem - プラグインを適用するHTML要素
 * @param {Object} option - オプションを格納した連想配列
 *
 * @prop {Object} option - オプションを格納した連想配列
 * @prop {Object} follow - 追尾要素の情報を格納した連想配列
 * @prop {Object} follow.elem - 追尾するHTML要素のjQueryオブジェクト
 * @prop {number} follow.offset_top - 追尾要素の元々のオフセット・トップ
 * @prop {number} follow.offset_bottom - 追尾要素の元々のオフセット・ボトム
 * @prop {number} follow.position_top - 追尾要素の元々のポジション・トップ
 * @prop {Object} timer - 連続したリサイズの発火を防ぐための遅延用のタイマー
 */
function SimpleScrollFollow(elem, option) {
	this.setOption(this, option);
	this.setFollow(this, elem);
	this._ehScroll();
	this._ehResize();
}

$.extend(SimpleScrollFollow.prototype, /** @lends SimpleScrollFollow.prototype */ {
	/**
	 * @desc スクロールを有効または無効にする
	 * @param {boolean} bool - true: 有効にする、 false: 無効にする
	 */
	setEnabled: function(bool) {
		this.option.enabled = bool;
		if (!this.option.enabled) this.moveDefaultPosition(this);
	},

	/**
	 * @desc 元の位置に戻る
	 * @param {Object} self - このクラスのインスタンスオブジェクト
	 */
	moveDefaultPosition: function(self) {
	 // JavaScriptでの追加設定を削除し、CSSで設定した値に戻す
		$(self.follow.elem)
			.css({
				position: '',
				top: '',
				bottom: '',
				left: '',
				right: '',
			})
			.width('');
	},

	/**
	 * @desc 追尾要素の設定をする
	 * @param {Object} self - このクラスのインスタンスオブジェクト
	 * @param {Object} elem - プラグインを適用するHTML要素
	 * @return {Object} - 追尾要素
	 */
	setFollow: function(self, elem) {
		var follow = {};
		follow.elem = elem;
		follow.width = $(follow.elem).width();
		follow.offset_top = $(follow.elem).offset().top;
		follow.offset_bottom = this._calcOffsetBottom(follow.elem);
		follow.offset_left = $(follow.elem).offset().left;

		// topの元の位置を記憶する前に、topの値がautoの場合はゼロに設定する。
		follow.position_top = ($(follow.elem).css('top') == 'auto') ?
			0 :
			Number($(follow.elem).css('top').replace(/px$/, ''));

		self.follow = follow;
	},

	/**
	 * @desc オプションを初期化する
	 * @param {Object} self - このクラスのインスタンスオブジェクト
	 * @param {Object} option - オプションを格納した連想配列
	 */
	setOption: function(self, option) {
		self.option = $.extend({
			enabled: true,
			limit_elem: $('body'),
			min_width: 0,
		}, option);
	},

	/**
	 * @private
	 * @desc offset_bottomを算出する
	 * @param {Object} elem - 算出する対象のHTML要素
	 * @return {number} - 算出されたoffset_bottom
	 */
	_calcOffsetBottom: function(elem) {
		if (elem == 'window') {
			return $(window).scrollTop() + $(window).height();
		} else {
			return $(elem).offset().top +
				$(elem).height() +
				Number($(elem).css('border-top-width').replace(/px$/, '')) +
				Number($(elem).css('border-bottom-width').replace(/px$/, '')) +
				Number($(elem).css('padding-top').replace(/px$/, '')) +
				Number($(elem).css('padding-bottom').replace(/px$/, ''));
		}
	},

	/**
	 * @private
	 * @desc イベントハンドラ: 画面スクロール
	 */
	_ehScroll: function() {
		var self = this;
		$(window).scroll(function() {
			 // スクロールが無効の場合は即座に終了する
			if (!self.option.enabled) return false;

			// 最低幅を下回る場合は即座に終了する
			if (!window.matchMedia('(min-width: ' + self.option.min_width +'px)').matches) {
				self.moveDefaultPosition(self);
				return false;
			}

			// 画面の上端、下端を取得
			var win = {
				scroll_top: $(this).scrollTop(),
				scroll_bottom: $(this).scrollTop() + $(this).height()
			};

			// 追尾要素の "現在の" 上端、下端を取得
			var current = {
				offset_top: $(self.follow.elem).offset().top,
				offset_bottom: self._calcOffsetBottom(self.follow.elem)
			};

			// 下限要素の下端を取得
			var limit = {offset_bottom: self._calcOffsetBottom(self.option.limit_elem)};

			// 下限 - 上限が要素高より低ければ即座に終了する
			if ((limit.offset_bottom - self.follow.offset_top) < (current.offset_bottom -current.offset_top)) return false;

			// ! positionのtopとoffsetのtopを混同しないように

			/* 分岐の構造
			if (画面上辺は上限より上か?) {
				要素上端は上限へ
			} else if (画面上辺は下限より下か?) {
				要素下端は下限へ
			} else if (画面高は要素高より高いか?) {
				if (下限 - 画面上辺は要素高より短いか?) {
					要素下端は下限へ
				} else {
					要素上端は画面上辺へ
				}
			} else {
				if (画面下辺は下限より下か?) {
					要素下端は下限へ
				} else if (画面下辺 - 上限 は、要素高より長いか?) {
					要素下端は画面下辺へ
				} else {
					要素上端は上限へ
				}
			}
			*/
			if (win.scroll_top  < self.follow.offset_top) { // 画面上辺は上限より上か?
				// absolute: 要素上端は上限へ
				$(self.follow.elem)
					.css({
						position: 'absolute',
						top: '',
						bottom: '',
						left: '',
						right: ''
					})
					.width(self.follow.width);
			} else if (win.scroll_top > limit.offset_bottom) { // 画面上辺は下限より下か?
				// absolute: 要素下端は下限へ
				$(self.follow.elem)
					.css({
						position: 'absolute',
						top: limit.offset_bottom - self.follow.offset_top - (current.offset_bottom - current.offset_top) + self.follow.position_top_num,
						bottom: 'auto',
						left: '',
						right: ''
					})
					.width(self.follow.width);
			} else if ((win.scroll_bottom - win.scroll_top) > (current.offset_bottom -current.offset_top)) { // 画面高は要素高より高いか?
				if ((limit.offset_bottom - win.scroll_top) < (current.offset_bottom -current.offset_top)) { // 下限 - 画面上辺 は、要素高より短いか?
					// absolute: 要素下端は下限へ
					$(self.follow.elem)
						.css({
							position: 'absolute',
							top: limit.offset_bottom - self.follow.offset_top - (current.offset_bottom - current.offset_top) + self.follow.position_top,
							bottom: 'auto',
							left: '',
							right: ''
						})
						.width(self.follow.width);
				} else {
					// fixed: 要素上端は画面上辺へ
					$(self.follow.elem)
						.css({
							position: 'fixed',
							top: 0,
							bottom: 'auto',
							left: self.follow.offset_left,
							right: 'auto'
						})
						.width(self.follow.width);
				}
			} else {
				if (win.scroll_bottom > limit.offset_bottom) { // 画面下辺は下限より下か?
					// absolute: 要素下端は下限へ
					$(self.follow.elem)
						.css({
							position: 'absolute',
							top: limit.offset_bottom - self.follow.offset_top - (current.offset_bottom - current.offset_top) + self.follow.position_top,
							bottom: 'auto',
							left: '',
							right: ''
						})
						.width(self.follow.width);
				} else if ((win.scroll_bottom - self.follow.offset_top) > (current.offset_bottom - current.offset_top)) { // 画面下辺 - 上限 は、要素高より長いか?
					// fixed: 要素下端は画面下辺へ
					$(self.follow.elem)
						.css({
							position: 'fixed',
							top: 'auto',
							bottom: 0,
							left: self.follow.offset_left,
							right: 'auto'
						})
						.width(self.follow.width);
				} else {
					// absolute: 要素上端は上限へ
					$(self.follow.elem)
						.css({
							position: 'absolute',
							top: '',
							bottom: '',
							left: '',
							right: ''
						})
						.width(self.follow.width);
				}
			}
		});
	},

	/**
	 * @private
	 * @desc イベントハンドラ: 画面リサイズ
	 */
	_ehResize: function() {
		this.timer = false;
		var self = this;
		$(window).resize(function() {
			if (self.timer !== false) {
				clearTimeout(self.timer);
			}
			self.timer = setTimeout(function() {
				self.moveDefaultPosition(self);
				self.setFollow(self, self.follow.elem);
				$(window).trigger('scroll');
			}, 200);
		});
	},
}); // endo of "$.extend"

})( /** namespace */ jQuery);