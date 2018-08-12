/** @external "jQuery.fn" */
/*global $*/
import fn_ajaxComboBox from './fn_ajaxComboBox';
import ajaxComboBox    from './ajaxComboBox';
import m03             from './method/03-_setOption';
import m04             from './method/04-_setMessage';
import m05             from './method/05-_setCssClass';
import m06             from './method/06-_setElem';
import m07             from './method/07-_setInitRecord';
import m08             from './method/08-_ehButton.js';
import m10             from './method/10-_getShortURL.js';
import m12             from './method/12-_scrollWindow.js';
import m14             from './method/14-_setTimerCheckValue.js';
import m16             from './method/16-_processKey.js';
import m18             from './method/18-_suggest.js';
import m20             from './method/20-_searchForDb.js';
import m22             from './method/22-_searchForJson.js';
import m24             from './method/24-_sortAsc.js';
import m26             from './method/26-_prepareResults.js';
import m28             from './method/28-_displayResults.js';
import m30             from './method/30-_firstPage.js';
import m32             from './method/32-_selectCurrentLine.js';
import m34             from './method/34-_nextLine.js';

$.fn.ajaxComboBox = fn_ajaxComboBox;
$.ajaxComboBox    = ajaxComboBox;
$.extend(
  $.ajaxComboBox.prototype,
  m03,
  m04,
  m05,
  m06,
  m07,
  m08,
  m10,
  m12,
  m14,
  m16,
  m18,
  m20,
  m22,
  m24,
  m26,
  m28,
  m30,
  m32,
  m34
);