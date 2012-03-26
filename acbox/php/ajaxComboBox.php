<?php
//****************************************************
//受け取ったデータの使用準備
//****************************************************

$db_table     = sqlite_escape_string($_GET['db_table']);
$q_word       = sqlite_escape_string($_GET['q_word']);
$page_num     = sqlite_escape_string($_GET['page_num']);
$per_page     = sqlite_escape_string($_GET['per_page']);
$field        = sqlite_escape_string($_GET['field']);
$search_field = sqlite_escape_string($_GET['search_field']);
$and_or       = sqlite_escape_string($_GET['and_or']);
$show_field   = sqlite_escape_string($_GET['show_field']);
$hide_field   = sqlite_escape_string($_GET['hide_field']);
$select_field = sqlite_escape_string($_GET['select_field']);
$order_field  = sqlite_escape_string($_GET['order_field']);
$primary_key  = sqlite_escape_string($_GET['primary_key']);
$order_by     = sqlite_escape_string($_GET['order_by']);

$offset       = ($page_num - 1) * $per_page;

//スペースやカンマ区切りで複数指定しているオプションを配列にする
$q_word       = preg_split('/[\s　]+/u', $q_word);
$search_field = preg_split('/[\s　]*,[\s　]*/u', trim($search_field));
$order_field  = preg_split('/[\s　]*,[\s　]*/u', trim($order_field));
$hide_field   = preg_split('/[\s　]*,[\s　]*/u', trim($hide_field));
$show_field   = ($show_field)
	? preg_split('/[\s　]*,[\s　]*/u', trim($show_field))
	: array(false);


//****************************************************
//DBへ接続
//****************************************************
$db = sqlite_open('../SQLite2/test.sqlite','0600');


//****************************************************
//SQL文を作成
//****************************************************
$query = '';

//----------------------------------------------------
// SELECT
//----------------------------------------------------
$query .= "SELECT $select_field ";

//----------------------------------------------------
// FROM
//----------------------------------------------------
$query .= "FROM $db_table ";

//----------------------------------------------------
// WHERE
//----------------------------------------------------
$where = 'WHERE ';

for($i=0; $i<count($q_word); $i++){
	if($i == 0){
		$where .= '( ';
	}else{
		$where .= ") $and_or ( ";
	}
	
	for($j=0; $j<count($search_field); $j++){
		if($j > 0) $where .= "OR ";
		$where .= "{$search_field[$j]} LIKE '%{$q_word[$i]}%' ";
	}	
}
$where .= ') ';
$query .= $where;
//----------------------------------------------------
// ORDER BY
//----------------------------------------------------
$query .= 'ORDER BY ( CASE ';
$cnt = 0;

for($i=0; $i<count($q_word); $i++){
	for($j=0; $j<count($order_field); $j++){
		$query .= "WHEN {$order_field[$j]} LIKE '{$q_word[$i]}' ";
		$query .= "THEN $cnt ";
		$cnt++;
		$query .= "WHEN {$order_field[$j]} LIKE '{$q_word[$i]}%' ";
		$query .= "THEN $cnt ";
		$cnt++;
	}
}

$query .= "ELSE $cnt END ) $order_by ";

//----------------------------------------------------
// LIMIT, OFFSET
//----------------------------------------------------
$query .= "LIMIT $per_page ";
$query .= "OFFSET $offset ";


//****************************************************
//DBへ問い合わせる
//****************************************************
$rows  = sqlite_query($db,$query);

$data = array();
$data['cnt_page'] = 0;
$attached_cnt = 0;

while ($row = sqlite_fetch_array($rows,SQLITE_ASSOC))
{
	$data['cnt_page'] ++;
	foreach($row as $key => $value){

		// for "select_only" option
		if($key == $primary_key){
			$data['primary_key'][] = $value;
		}

		// get the value for autocomplete candidate
		if($key == $field){
			$data['candidate'][] = $value;

		} else {

			// for Sub-info
			if(!in_array($key, $hide_field)){

				// It non-displays it in the exclusion column when not corresponding
				// to the display column though it doesn't correspond.
				// However, it doesn't become non-display when there is "*"
				// in the display column.
				if(
					$show_field[0] !== false
					&& !in_array('*', $show_field)
					&& !in_array($key, $show_field)
				){
					continue;
				}

				$data['attached'][$attached_cnt][] = array(
					0 => $key,
					1 => $value
				);
			}
		}
	}
	$attached_cnt++;
}
//****************************************************
//全ヒット数を得る
//****************************************************
$query = "SELECT * FROM $db_table $where";
$data['cnt'] = sqlite_num_rows(sqlite_query($db,$query));

//****************************************************
//終了
//****************************************************
echo json_encode($data);
sqlite_close($db);

?>
