/*global $*/
/** @lends external:jQuery.ajaxComboBox.prototype */
export default {
  /**
   * Prepare to display search results.
   * @private
   * @param {object} self - このクラスのインスタンスオブジェクトへの参照
   * @param {object} json - サーバからのレスポンス
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
   * Create navigation of result list
   * @private
   * @param {object} self - このクラスのインスタンスオブジェクトへの参照
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
              'href': 'javascript:void(0)',
              'class': 'navi_first'
            })
            .text('<< 1')
            .attr('title', self.message.first_title)
            .appendTo(self.elem.navi_p);
        }
        $('<a>')
          .attr({
            'href': 'javascript:void(0)',
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
            'href': 'javascript:void(0)',
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
            'href': 'javascript:void(0)',
            'class': 'navi_next'
          })
          .text(self.message.next)
          .attr('title', self.message.next_title)
          .appendTo(self.elem.navi_p);
        if (!self.option.navi_simple) {
          $('<a>')
            .attr({
              'href': 'javascript:void(0)',
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
   * Prepare to display sub info.
   * @private
   * @param {object} self - このクラスのインスタンスオブジェクトへの参照
   * @param {object} obj - Main info ( <li> )
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
  }
};