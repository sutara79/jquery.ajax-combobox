// ページ内リンク(固定グローバルナビに対応) ajax-comboboxのみ
$(document).on('click', '#contents a[href^="#"]', function(ev) {
  ev.preventDefault();
  var href= $(this).attr('href');
  var target = $((href == '#' || href === '') ? 'html' : href);
  var position = target.offset().top - 54; // -54 is .navbar height
  console.log(position);
  $('body, html').scrollTop(position); // can not use .animate on jquery.slim
  history.pushState('', '', $(this)[0].href);
  return false;
});

// 英語・日本語切り替え
$('.js-btn-lang').click(function(ev) {
  $('body [lang]').hide();
  $('.js-btn-lang').removeAttr('disabled');
  $('body [lang="' + $(ev.currentTarget).data('lang') + '"]').show();
  $(ev.currentTarget).attr('disabled', 'disabled');
});
$('#lang-en').trigger('click');

// 追尾スクロール (英語・日本語切り替えよりも後にすること)
$('#js-menu-follow').simpleScrollFollow({
  min_width: 960,
  limit_elem: 'article',
  upper_side: '.navbar'
});

// 見出し横のリンクを生成
$('section.card').each(function() {
  var link = $('<a class="js-anchor">#</a>');
  $(link).attr('href', '#' + $(this).attr('id'));
  $(this).find('.card-header').prepend(link);
});