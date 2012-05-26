var data = [
	{'id':'A001','name':'Adams','post':'Sales','position':'The rank and file'},
	{'id':'A002','name':'Darling','post':'Sales','position':'The rank and file'},
	{'id':'A003','name':'Kingston','post':'General Affairs','position':'Chief clerk'},
	{'id':'A004','name':'Darling','post':'General Affairs','position':'Section chief'},
	{'id':'A005','name':'Adams','post':'Personnel','position':'The rank and file'},
	{'id':'A006','name':'Kingston','post':'Sales','position':'Director'},
	{'id':'A007','name':'Kingston','post':'Sales','position':'Section chief'},
	{'id':'A008','name':'Darling','post':'Personnel','position':'Chief'},
	{'id':'A009','name':'Adams','post':'Personnel','position':'Chief'},
	{'id':'A010','name':'Adams','post':'General Affairs','position':'The rank and file'},
	{'id':'A011','name':'Darling','post':'General Affairs','position':'The rank and file'},
	{'id':'A012','name':'Kingston','post':'Sales','position':'The rank and file'},
	{'id':'A013','name':'MacKenzie','post':'Sales','position':'Chief clerk'},
	{'id':'A014','name':'Darling','post':'Sales','position':'Vice-chief'},
	{'id':'A015','name':'MacKenzie','post':'General Affairs','position':'Vice-chief'},
	{'id':'A016','name':'Kingston','post':'Personnel','position':'Director'},
	{'id':'A017','name':'MacKenzie','post':'Personnel','position':'Section chief'},
	{'id':'A018','name':'MacKenzie','post':'Sales','position':'Chief'}
];
jQuery(document).ready(function($){

	//------------------------------------------------------
	//Basic
	//------------------------------------------------------
	$('#ac01_01').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'lang'        : 'en',
			'db_table'    : 'en_nation',
			'order_field' : 'id'
		}
	);
	$('#ac01_02').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'lang'        : 'en',
			'db_table'    : 'en_name',
			'per_page'    : 20,
			'navi_num'    : 10
		}
	);
	$('#ac01_03').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'lang'        : 'en',
			'db_table'    : 'en_name',
			'navi_num'    : 1,
			'navi_simple' : true
		}
	);
	$('#ac01_04').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'lang'        : 'en',
			'db_table'    : 'en_nation',
			'search_field': 'name, id'
		}
	);
	$('#ac01_05').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'lang'        : 'en',
			'db_table'    : 'en_nation',
			'and_or'      : 'OR'
		}
	);
	//------------------------------------------------------
	//Sub-info
	//------------------------------------------------------
	$('#ac02_01').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'lang'        : 'en',
			'db_table'    : 'en_employee',
			'sub_info'    : true
		}
	);
	$('#ac02_02').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'lang'        : 'en',
			'db_table'    : 'en_employee',
			'sub_info'    : true,
			'sub_as'      : {
				'id'       : 'Employer ID',
				'post'     : 'Post',
				'position' : 'Position'
			}
		}
	);
	$('#ac02_03').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'lang'        : 'en',
			'db_table'    : 'en_employee',
			'sub_info'    : true,
			'sub_as'      : {
				'post'     : 'Post',
				'position' : 'Position'
			},
			'show_field'  : 'position,post'
		}
	);
	$('#ac02_04').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'lang'        : 'en',
			'db_table'    : 'en_employee',
			'sub_info'    : true,
			'sub_as'      : {
				'id'       : 'Employer ID'
			},
			'hide_field'  : 'position,post'
		}
	);
	$('#ac02_05').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'lang'        : 'en',
			'db_table'    : 'en_employee',
			'sub_info'    : true
		}
	);
	//------------------------------------------------------
	//Select-only
	//------------------------------------------------------
	$('#ac03_01').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'lang'        : 'en',
			'db_table'    : 'en_employee',
			'sub_info'    : true,
			'select_only' : true
		}
	);
	$('#ac03_02').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'lang'        : 'en',
			'db_table'    : 'en_nation',
			'order_field' : 'id',
			'sub_info'    : true,
			'show_field'  : 'id',
			'select_only' : true,
			'primary_key' : 'name'
		}
	);
	//------------------------------------------------------
	//Initial Value
	//------------------------------------------------------
	$('#ac04_01').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'lang'        : 'en',
			'db_table'    : 'en_nation',
			'order_field' : 'id',
			'init_val'    : 'Japan'
		}
	);
	$('#ac04_02').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'lang'        : 'en',
			'db_table'    : 'en_nation',
			'order_field' : 'id',
			'init_val'    : 28,
			'select_only' : true,
			'primary_key' : 'id'
		}
	);
	//------------------------------------------------------
	//Search from JSON without database
	//------------------------------------------------------
	$('#ac05_01').ajaxComboBox(
		data,
		{
			'lang'        : 'en',
			'sub_info'    : true,
			'sub_as'      : {
				'id'       : 'Employer ID',
				'post'     : 'Post',
				'position' : 'Position'
			},
			'select_only' : true,
			'init_val'    : ['A009'],
			'primary_key' : 'id'
		}
	);
	//------------------------------------------------------
	//Submitting at once when selected
	//------------------------------------------------------
	$('#ac06_01').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'lang'        : 'en',
			'db_table'    : 'en_nation',
			'order_field' : 'id',
			'bind_to'     : 'foo'
		}
	)
	.bind('foo', function(){
		alert($(this).val() + ' is selected.');
	});
	$('#ac06_02').ajaxComboBox(
		'acbox/jquery.ajaxComboBox.php',
		{
			'lang'        : 'en',
			'db_table'    : 'en_nation',
			'order_field' : 'id',
			'bind_to'     : 'foo'
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
});
function displayResult(id){
	if($('#' + id + '_hidden').length > 0){
		alert($('#' + id + '_hidden').val());
	}else{
		alert($('#' + id).val());
	}
}
