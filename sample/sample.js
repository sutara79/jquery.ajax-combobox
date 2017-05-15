$(function() {
  // ページ内リンクのスクロール
  $(document).on('click', '#contents a[href^="#"]', function(ev) {
    ev.preventDefault();
    var href= $(this).attr('href');
    var target = $((href == '#' || href === '') ? 'html' : href);
    var position = target.offset().top - 51; // -51 is .navbar height
    console.log(position);
    $('body, html').animate({scrollTop: position}, 200, 'swing');
    history.pushState('', '', $(this)[0].href);
    return false;
  });

  // 英語・日本語切り替え
  $('#language button').click(function(ev) {
    $('*[class*="lang_"]').hide();
    $('button[id*="lang_"]').removeAttr('disabled');
    $('.' + $(ev.target).attr('id')).show();
    $(ev.target).attr('disabled', 'disabled');
  });
  $('#lang_en').trigger('click');

  // 追尾スクロール (英語・日本語切り替えよりも後にすること)
  $('#index').simpleScrollFollow({
    min_width: 992,
    limit_elem: 'article',
    upper_side: '.navbar'
  });

  // 見出し横のリンクを生成
  $('section.panel-primary').each(function() {
    var link = $('<a class="js-anchor"><span class="glyphicon glyphicon-link" aria-hidden="true"></span></a>');
    $(link).attr('href', '#' + $(this).attr('id'));
    $(this).find('h3.panel-title').prepend(link);
  });
});