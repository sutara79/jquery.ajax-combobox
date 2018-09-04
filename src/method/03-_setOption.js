/*global $*/
/** @lends external:jQuery.ajaxComboBox.prototype */
export default {
  /**
   * Initialize options
   *
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
   * Initialize options (1st step)
   *
   * @private
   * @arg {string|object} source - Server side file such as PHP. Or, JS object which contains data.
   * @arg {object} option - Options sent by user.
   * @return {object} - Options at which the 1st step has ended.
   */
  _setOption1st: function(source, option) {
    return $.extend({
      // Basic
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
      button_img: '<svg class="octicon octicon-chevron-down" viewBox="0 0 10 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M5 11L0 6l1.5-1.5L5 8.25 8.5 4.5 10 6z"></path></svg>',
      bind_to: false,
      navi_simple: false,

      // Sub-info
      sub_info: false,
      sub_as: {},
      show_field: '',
      hide_field: '',

      // Select-only
      select_only: false,

      // Tags
      tags: false,

      // Shorten URL
      shorten_btn: false,
      shorten_src: 'dist/bitly.php',
      shorten_min: 20,
      shorten_reg: false
    }, option);
  },

  /**
   * Initialize options (2nd step)
   *
   * @private
   * @arg {object} option - Options at which the 1st step has ended.
   * @return {object} - Options at which the 2nd step has ended.
   */
  _setOption2nd: function(option) {
    // A field to search (allows comma separated)
    option.search_field = (option.search_field) ? option.search_field : option.field;

    // Unify with uppercase
    option.and_or = option.and_or.toUpperCase();

    // Split string into array by comma
    option.hide_field   = this._strToArray(option.hide_field);
    option.show_field   = this._strToArray(option.show_field);
    option.search_field = this._strToArray(option.search_field);

    // Show whole rest fields as sub info, if "show_field" is not set.
    if (option.show_field[0] === '') {
      option.show_field[0] = '*'
    }

    // "ORDER BY" after "CASE WHEN"
    option.order_by = (option.order_by === undefined) ?
      option.search_field :
      option.order_by;

    // Make order_by to multidimensional array
    // Example:  [ ['id', 'ASC'], ['name', 'DESC'] ]
    option.order_by = this._setOrderbyOption(option.order_by, option.field);

    // Text area
    if (option.plugin_type == 'textarea') {
      option.shorten_reg = this._setRegExpShort(option.shorten_reg, option.shorten_min);
    }

    // Tags
    if (option.tags) {
      option.tags = this._setTagPattern(option);
    }
    return option;
  },

  /**
   * Split string into array by comma.
   *
   * @private
   * @arg {string} str - Comma separated string
   * @return {array} Array splitted by comma
   */
  _strToArray: function(str) {
    return str.replace(/[\s　]+/g, '').split(',');
  },

  /**
   * Create regex to search URL.
   *
   * @private
   * @arg {object|boolean} shorten_reg - Regex object set by user. Or false.
   * @return {object} - Regex object
   */
  _setRegExpShort: function(shorten_reg, shorten_min) {
    // Use regex set by user if it exists
    if (shorten_reg) return shorten_reg;

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
   * Initialize options for tags.
   *
   * @private
   * @arg {object} option - Options
   * @return {object} - Options for tags
   */
  _setTagPattern: function(option) {
    for (var i = 0; i < option.tags.length; i++) {
      option.tags[i] = this._setTagOptions(option, i);
      option.tags[i].pattern = this._setRegExpTag(option.tags[i].pattern, option.tags[i].space);
    }
    return option.tags;
  },

  /**
   * Initialize options (except for regex) for a tag.
   *
   * @private
   * @arg {object} option - Options
   * @arg {number} idx - Index of current selected tag
   * @return {object} - Options (except for regex) of a tag
   */
  _setTagOptions: function(option, idx) {
    option.tags[idx] = $.extend({
      // Insert space
      space: [true, true],
      
      // DB
      db_table: option.db_table,
      field: option.field,
      search_field: option.search_field,
      primary_key: option.primary_key,

      // Sub-info
      sub_info: option.sub_info,
      sub_as: option.sub_as,
      show_field: option.show_field,
      hide_field: option.hide_field
    }, option.tags[idx]);

    // Convert comma separated options to array.
    var arr = ['hide_field', 'show_field', 'search_field'];
    for (var i = 0; i < arr.length; i++) {
      if (typeof option.tags[idx][arr[i]] != 'object') {
        option.tags[idx][arr[i]] = this._strToArray(option.tags[idx][arr[i]]);
      }
    }

    // Make order_by to array.
    option.tags[idx].order_by = (option.tags[idx].order_by === undefined) ?
      option.order_by :
      this._setOrderbyOption(option.tags[idx].order_by, option.tags[idx].field);

    return option.tags[idx];
  },

  /**
   * Create regex to search tags.
   *
   * @private
   * @arg {Array} pattern - Pair of start and end of tag
   * @arg {Array} space - Pair of start and end of space
   * @return {object} - Object of regexes
   */
  _setRegExpTag: function(pattern, space) {
    // Escape for regex
    var esc_left  = pattern[0].replace(/[\s\S]*/, this._escapeForReg);
    var esc_right = pattern[1].replace(/[\s\S]*/, this._escapeForReg);

    return {
      // Save original parentheses
      left: pattern[0],
      right: pattern[1],

      // Regex that extracts from the caret to the start of the tag in a string.
      reg_left: new RegExp(esc_left + '((?:(?!' + esc_left + '|' + esc_right + ')[^\\s　])*)$'),

      // Regex that extracts from the caret to the end of the tag in a string.
      reg_right: new RegExp('^((?:(?!' + esc_left + '|' + esc_right + ')[^\\s　])+)'),

      // Regex to decide whether to insert space before the start of tag after user select.
      space_left: new RegExp('^' + esc_left + '$|[\\s　]+' + esc_left + '$'),

      // Regex to decide whether to insert space after the end of tag after user select.
      space_right: new RegExp('^$|^[\\s　]+'),

      // Regex to decide whether to complement parentheses after user select.
      comp_right: new RegExp('^' + esc_right)
    };
  },

  /**
   * Callback function to escape for regex.
   *
   * @private
   * @arg {string} text - The matched substring.
   * @return {string} - Escaped string
   */
  _escapeForReg: function(text) {
    return '\\u' + (0x10000 + text.charCodeAt(0)).toString(16).slice(1);
  },

  /**
   * Adjust an array of "ORDER BY" to use it in the code.
   *
   * @private
   * @arg {Array|string} orders - Array of "ORDER BY" (not have processed).
   * @arg {string} field - Field to search.
   * @return {Array} - Array of "ORDER BY" (have processed).
   */
  _setOrderbyOption: function(orders, field) {
    if (typeof orders == 'string') orders = new Array(orders);

    var result = [];
    var arrSplit = [];

    for (var i = 0; i < orders.length; i++) {
      arrSplit = $.trim(orders[i]).split(/ +/);
      result[i] = (arrSplit.length == 2) ?
        arrSplit :
        (arrSplit[0].match(/^(ASC|DESC)$/i)) ? // In the future, lowercase "asc" or "desc" are judged to be field names.
          [field, arrSplit[0]] :
          [arrSplit[0], 'ASC'];
    }

    return result;
  }
};