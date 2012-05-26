var data = [
	{'id':'A001','name':'田中','post':'営業部','position':'一般'},
	{'id':'A002','name':'佐藤','post':'営業部','position':'一般'},
	{'id':'A003','name':'鈴木','post':'総務部','position':'係長'},
	{'id':'A004','name':'佐藤','post':'総務部','position':'課長'},
	{'id':'A005','name':'田中','post':'人事部','position':'一般'},
	{'id':'A006','name':'鈴木','post':'営業部','position':'部長'},
	{'id':'A007','name':'鈴木','post':'営業部','position':'課長'},
	{'id':'A008','name':'佐藤','post':'人事部','position':'主任'},
	{'id':'A009','name':'田中','post':'人事部','position':'主任'},
	{'id':'A010','name':'田中','post':'総務部','position':'一般'},
	{'id':'A011','name':'佐藤','post':'総務部','position':'一般'},
	{'id':'A012','name':'鈴木','post':'営業部','position':'一般'},
	{'id':'A013','name':'山本','post':'営業部','position':'係長'},
	{'id':'A014','name':'佐藤','post':'営業部','position':'次長'},
	{'id':'A015','name':'山本','post':'総務部','position':'次長'},
	{'id':'A016','name':'鈴木','post':'人事部','position':'部長'},
	{'id':'A017','name':'山本','post':'人事部','position':'課長'},
	{'id':'A018','name':'山本','post':'営業部','position':'主任'}
];
jQuery(document).ready(function($){
	
	$('#test').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'plugin_type' : 'simple',
			'db_table'    : 'ja_prefecture',
			'order_field' : 'id',
			'sub_info'    : 'simple'
		}
	);

	//------------------------------------------------------
	//基本
	//------------------------------------------------------
	
	$('#ac01_01').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'db_table'    : 'ja_prefecture',
			'order_field' : 'id'
		}
	);
	
	$('#ac01_02').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'db_table'    : 'ja_name',
			'per_page'    : 20,
			'navi_num'    : 10
		}
	);
	$('#ac01_03').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'db_table'    : 'ja_name',
			'navi_num'    : 1,
			'navi_simple' : true
		}
	);
	$('#ac01_04').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'db_table'    : 'ja_prefecture',
			'search_field': 'name, id'
		}
	);
	$('#ac01_05').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'db_table'    : 'ja_prefecture',
			'and_or'      : 'OR'
		}
	);
	//------------------------------------------------------
	//サブ情報
	//------------------------------------------------------
	$('#ac02_01').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'db_table'    : 'ja_employee',
			'sub_info'    : true
		}
	);
	$('#ac02_02').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'db_table'    : 'ja_employee',
			'sub_info'    : true,
			'sub_as'      : {
				'id'       : '社員番号',
				'post'     : '部署',
				'position' : '役職'
			}
		}
	);
	$('#ac02_03').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'db_table'    : 'ja_employee',
			'sub_info'    : true,
			'sub_as'      : {
				'post'     : '部署',
				'position' : '役職'
			},
			'show_field'  : 'position,post'
		}
	);
	$('#ac02_04').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'db_table'    : 'ja_employee',
			'sub_info'    : true,
			'sub_as'      : {
				'id'       : '社員番号'
			},
			'hide_field'  : 'position,post'
		}
	);
	$('#ac02_05').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'db_table'    : 'ja_employee',
			'sub_info'    : true
		}
	);
	//------------------------------------------------------
	//セレクト専用
	//------------------------------------------------------
	$('#ac03_01').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'db_table'    : 'ja_employee',
			'sub_info'    : true,
			'select_only' : true
		}
	);
	$('#ac03_02').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'db_table'    : 'ja_prefecture',
			'order_field' : 'id',
			'sub_info'    : true,
			'show_field'  : 'id',
			'select_only' : true,
			'primary_key' : 'name'
		}
	);
	//------------------------------------------------------
	//初期値設定
	//------------------------------------------------------
	$('#ac04_01').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'db_table'    : 'ja_prefecture',
			'order_field' : 'id',
			'init_val'    : '東京都'
		}
	);
	$('#ac04_02').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'db_table'    : 'ja_prefecture',
			'order_field' : 'id',
			'init_val'    : 13,
			'select_only' : true,
			'primary_key' : 'id'
		}
	);
	//------------------------------------------------------
	//データベースではなく、JSON形式のデータを検索する
	//------------------------------------------------------
	$('#ac05_01').ajaxComboBox(
		data,
		{
			'sub_info'    : true,
			'sub_as'      : {
				'id'       : '社員番号',
				'post'     : '部署',
				'position' : '役職'
			},
			'select_only' : true,
			'init_val'    : ['A009'],
			'primary_key' : 'id'
		}
	);
	//------------------------------------------------------
	//候補選択と同時に、別のイベントを発火する
	//------------------------------------------------------
	$('#ac06_01').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'db_table'    : 'ja_prefecture',
			'order_field' : 'id',
			'bind_to'     : 'foo'
		}
	)
	.bind('foo', function(){
		alert($(this).val() + ' が選択されました');
	});
	$('#ac06_02').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'db_table'    : 'ja_prefecture',
			'order_field' : 'id',
			'bind_to'     : 'foo'
		}
	)
	.bind('foo', function(e, is_enter_key){
		if(!is_enter_key){
			alert($(this).val() + ' が選択されました(マウスで選択)');
		}
	})
	.keydown(function(e){
		if(e.keyCode == 13) alert($(this).val() + ' が選択されました(Enterキーで選択)');
	});
});

function displayResult(id){
	if($('#' + id + '_hidden').length > 0){
		alert($('#' + id + '_hidden').val());
	}else{
		alert($('#' + id).val());
	}
}
