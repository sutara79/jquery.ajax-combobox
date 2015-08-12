// Object instead of Database
var data = [
  {id:'A001',name:'Adams',    post:'Sales',          position:'The rank and file'},
  {id:'A002',name:'Darling',  post:'Sales',          position:'The rank and file'},
  {id:'A003',name:'Kingston', post:'General Affairs',position:'Chief clerk'},
  {id:'A004',name:'Darling',  post:'General Affairs',position:'Section chief'},
  {id:'A005',name:'Adams',    post:'Personnel',      position:'The rank and file'},
  {id:'A006',name:'Kingston', post:'Sales',          position:'Director'},
  {id:'A007',name:'Kingston', post:'Sales',          position:'Section chief'},
  {id:'A008',name:'Darling',  post:'Personnel',      position:'Chief'},
  {id:'A009',name:'Adams',    post:'Personnel',      position:'Chief'},
  {id:'A010',name:'Adams',    post:'General Affairs',position:'The rank and file'},
  {id:'A011',name:'Darling',  post:'General Affairs',position:'The rank and file'},
  {id:'A012',name:'Kingston', post:'Sales',          position:'The rank and file'},
  {id:'A013',name:'MacKenzie',post:'Sales',          position:'Chief clerk'},
  {id:'A014',name:'Darling',  post:'Sales',          position:'Vice-chief'},
  {id:'A015',name:'MacKenzie',post:'General Affairs',position:'Vice-chief'},
  {id:'A016',name:'Kingston', post:'Personnel',      position:'Director'},
  {id:'A017',name:'MacKenzie',post:'Personnel',      position:'Section chief'},
  {id:'A018',name:'MacKenzie',post:'Sales',          position:'Chief'}
];
var tag_data = [
  {id:1 ,name:'PhysicalEducation',japanese:'体育学'},
  {id:2 ,name:'Musicology',       japanese:'音楽学'},
  {id:3 ,name:'Mathematics',      japanese:'数学'},
  {id:4 ,name:'Biology',          japanese:'生物学'},
  {id:5 ,name:'Chemistry',        japanese:'化学'},
  {id:6 ,name:'Sociology',        japanese:'社会学'},
  {id:7 ,name:'Linguistics',      japanese:'言語学'},
  {id:8 ,name:'Anthropology',     japanese:'人類学'},
  {id:9 ,name:'Philosophy',       japanese:'哲学'},
  {id:10,name:'Geometry',         japanese:'幾何学'},
  {id:11,name:'Architecture',     japanese:'建築学'},
  {id:12,name:'PoliticalScience', japanese:'政治学'},
  {id:13,name:'Jurisprudence',    japanese:'法律学'},
  {id:14,name:'Archaeology',      japanese:'考古学'},
  {id:15,name:'History',          japanese:'歴史学'},
  {id:16,name:'Psychology',       japanese:'心理学'},
  {id:17,name:'MedicalScience',   japanese:'医学'},
  {id:18,name:'Literature',       japanese:'文学'},
  {id:19,name:'Astronomy',        japanese:'天文学'}
];

jQuery(document).ready(function($) {
  /**
   * Basic
   */
  $('#ac01_01').ajaxComboBox(
    'dist/jquery.ajax-combobox.php',
    {
      lang: 'en',
      db_table: 'nation'
    }
  );
  $('#ac01_02').ajaxComboBox(
    'dist/jquery.ajax-combobox.php',
    {
      lang: 'en',
      db_table: 'name',
      per_page: 20,
      navi_num: 10
    }
  );
  $('#ac01_03').ajaxComboBox(
    'dist/jquery.ajax-combobox.php',
    {
      lang: 'en',
      db_table: 'name',
      navi_num: 1,
      navi_simple: true
    }
  );
  $('#ac01_04').ajaxComboBox(
    'dist/jquery.ajax-combobox.php',
    {
      lang: 'en',
      db_table: 'nation',
      search_field: 'name, id'
    }
  );
  $('#ac01_05').ajaxComboBox(
    'dist/jquery.ajax-combobox.php',
    {
      lang: 'en',
      db_table: 'nation',
      and_or: 'OR'
    }
  );
  $('#ac01_06').ajaxComboBox(
    'dist/jquery.ajax-combobox.php',
    {
      lang: 'en',
      db_table: 'nation',
      field: 'name',
      order_by: [
        'name DESC',
        'created'
      ]
    }
  );
  $('#ac01_07_01').ajaxComboBox('dist/jquery.ajax-combobox.php', {lang: 'de', db_table: 'nation'});
  $('#ac01_07_02').ajaxComboBox('dist/jquery.ajax-combobox.php', {lang: 'es', db_table: 'nation'});
  $('#ac01_07_03').ajaxComboBox('dist/jquery.ajax-combobox.php', {lang: 'pt-br', db_table: 'nation'});
  $('#ac01_07_04').ajaxComboBox('dist/jquery.ajax-combobox.php', {db_table: 'nation'});

  /**
   * Display Sub-info
   */
  $('#ac02_01').ajaxComboBox(
    'dist/jquery.ajax-combobox.php',
    {
      lang: 'en',
      db_table: 'employee',
      sub_info: true
    }
  );
  $('#ac02_02').ajaxComboBox(
    'dist/jquery.ajax-combobox.php',
    {
      lang: 'en',
      db_table: 'employee',
      sub_info: true,
      sub_as: {
        id: 'Employer ID',
        post: 'Post',
        position: 'Position'
      }
    }
  );
  $('#ac02_03').ajaxComboBox(
    'dist/jquery.ajax-combobox.php',
    {
      lang: 'en',
      db_table: 'employee',
      sub_info: true,
      sub_as: {
        post: 'Post',
        position: 'Position'
      },
      show_field: 'position,post'
    }
  );
  $('#ac02_04').ajaxComboBox(
    'dist/jquery.ajax-combobox.php',
    {
      lang: 'en',
      db_table: 'employee',
      sub_info: true,
      sub_as: {
        id: 'Employer ID'
      },
      hide_field: 'position,post'
    }
  );
  $('#ac02_05').ajaxComboBox(
    'dist/jquery.ajax-combobox.php',
    {
      lang: 'en',
      db_table: 'employee',
      sub_info: 'simple',
      show_field: 'post'
    }
  );
  $('#ac02_06').ajaxComboBox(
    'dist/jquery.ajax-combobox.php',
    {
      lang: 'en',
      db_table: 'employee',
      sub_info: true
    }
  );

  /**
   * Select-only
   */
  $('#ac03_01').ajaxComboBox(
    'dist/jquery.ajax-combobox.php',
    {
      lang: 'en',
      db_table: 'employee',
      sub_info: true,
      select_only: true
    }
  );
  $('#ac03_02').ajaxComboBox(
    'dist/jquery.ajax-combobox.php',
    {
      lang: 'en',
      db_table: 'nation',
      sub_info: true,
      show_field: 'id',
      select_only: true,
      primary_key: 'name'
    }
  );

  /**
   * After selected
   */
  $('#ac06_01').ajaxComboBox(
    'dist/jquery.ajax-combobox.php',
    {
      lang: 'en',
      db_table: 'nation',
      bind_to: 'foo'
    }
  )
  .bind('foo', function(){
    alert($(this).val() + ' is selected.');
  });
  $('#ac06_02').ajaxComboBox(
    'dist/jquery.ajax-combobox.php',
    {
      lang: 'en',
      db_table: 'nation',
      bind_to: 'foo'
    }
  )
  .bind('foo', function(e, is_enter_key){
    if(!is_enter_key){
      alert($(this).val() + ' is selected. (by mouse)');
    }
  })
  .keydown(function(e){
    if(e.keyCode == 13) alert($(this).val() + ' is selected. (by enter key)');
  });

  /**
   * Others
   */
  $('#ac04_01').ajaxComboBox(
    'dist/jquery.ajax-combobox.php',
    {
      lang: 'en',
      db_table: 'nation',
      init_record: 28
    }
  );
  $('#ac05_01').ajaxComboBox(
    data,
    {
      lang: 'en',
      sub_info: true,
      sub_as: {
        id: 'Employer ID',
        post: 'Post',
        position: 'Position'
      },
      select_only: true,
      init_record: ['A009'],
      primary_key: 'id',
    }
  );
  $('#ac07_01').ajaxComboBox(
    'dist/jquery.ajax-combobox.php',
    {
      lang: 'en',
      plugin_type: 'simple',
      db_table: 'nation',
      sub_info: true
    }
  );
  var arr_instance = $('#ac07_02').ajaxComboBox(
    '-----',
    {
      lang: 'en',
      db_table: '-----',
      instance: true
    }
  );
  $(arr_instance).each(function() {
    this.option.source = 'dist/jquery.ajax-combobox.php';
    this.option.db_table = 'nation';
  });

  /**
   * Textarea (tag and shorten url)
   */
  $('#ac08_01').ajaxComboBox(
    'dist/jquery.ajax-combobox.php',
    {
      lang: 'en',
      plugin_type: 'textarea',
      tags: [
        {
          pattern: ['#', ''],
          db_table: 'tag'
        }
      ]
    }
  );
  $('#ac08_02').ajaxComboBox(
    'dist/jquery.ajax-combobox.php',
    {
      lang: 'en',
      plugin_type: 'textarea',
      tags: [
        {
          pattern: ['[', ']'],
          space: [false, false],
          db_table: 'tag'
        }
      ],
    }
  );
  $('#ac08_03').ajaxComboBox(
    tag_data,
    {
      lang: 'en',
      plugin_type: 'textarea',
      tags: [
        {
          pattern: ['@', ''],
          db_table: 'tag'
        }
      ],
    }
  );
  $('#ac08_04').ajaxComboBox(
    'dist/jquery.ajax-combobox.php',
    {
      lang: 'en',
      plugin_type: 'textarea',
      tags: [
        {
          pattern: ['[', ']'],
          space: [false, false],
          db_table: 'tag'
        },
        {
          pattern: ['#', ''],
          db_table: 'tag'

        },
        {
          pattern: ['@', ''],
          db_table: 'tag'
        }
      ],
    }
  );
  $('#ac08_05').ajaxComboBox(
    'dist/jquery.ajax-combobox.php',
    {
      lang: 'en',
      plugin_type: 'textarea',
      tags: [
        {
          pattern: ['[', ']'],
          space: [false, false],
          db_table: 'tag',
          sub_info: true
        },
        {
          pattern: ['#', ''],
          db_table: 'tag',
          sub_info: true,
          sub_as: {
            id: 'TagID',
            japanese: '日本語'
          }
        },
        {
          pattern: ['@', ''],
          db_table: 'tag',
          order_by: 'name DESC'
        }
      ],
    }
  );
  $('#ac08_06').ajaxComboBox(
    'dist/jquery.ajax-combobox.php',
    {
      lang: 'en',
      plugin_type: 'textarea',
      shorten_btn: '#ac08_06_shorten',
      shorten_src: 'dist/bitly.php',
      shorten_min: 20
    }
  );
  $('#ac08_07').ajaxComboBox(
    'dist/jquery.ajax-combobox.php',
    {
      lang: 'en',
      plugin_type: 'textarea',
      db_table: 'tag',
      shorten_btn: '#ac08_07_shorten',
      shorten_src: 'dist/bitly.php',
      shorten_min: 20,
      tags: [
        {
          pattern: ['[', ']'],
          space: [false, false]
        },
        {
          pattern: ['#', '']

        },
        {
          pattern: ['@', '']
        }
      ],
    }
  );

  // ページ内リンクのスクロール
  $('a[href^=#]').click(function() {
    var href= $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top - 10;
    $('body,html').animate({scrollTop: position}, 200, 'swing');
    history.pushState('', '', $(this)[0].href);
    return false;
  });

  // 英語・日本語切り替え
  $('#language button').click(function(ev) {
    $('*[class*=lang_]').hide();
    $('button[id*=lang_]').removeAttr('disabled');
    $('.' + $(ev.target).attr('id')).show();
    $(ev.target).attr('disabled', 'disabled');
  });
  $('#lang_en').trigger('click');

  // 追尾スクロール (英語・日本語切り替えよりも後にすること)
  $('nav').simpleScrollFollow({
    min_width: 992,
    limit_elem: $('article')
  });
}); // end of "jQuery(document).ready"

function displayResult(id) {
  alert(
    id + ': ' + $('#' + id).val() + '\n' +
    id + '_primary_key' + ': ' + $('#' + id + '_primary_key').val()
  );
}