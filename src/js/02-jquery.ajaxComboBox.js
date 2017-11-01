/**
 * @class external:jQuery.ajaxComboBox
 * @classdesc 要素ごとに適用される処理を集めたクラス
 * @param {Object} combo_input - プラグインを適用するHTML要素。
 * @param {string|Object} source - サーバ側のプログラム、もしくは連想配列そのもの。
 * @param {Object} option - オプションを収めた連想配列。
 */
$.ajaxComboBox = function(combo_input, source, option) {
  this.option = this._setOption(source, option);
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
};
