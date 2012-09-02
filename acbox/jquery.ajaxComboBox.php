<?php
//++++++++++++++++++++++++++++++++++++++++++++++++++++
//You MUST change this value.
$sqlite = array(
	'path'   => '../sample/sample.sqlite3',
);
//++++++++++++++++++++++++++++++++++++++++++++++++++++


//****************************************************
//Connect to Database.
//****************************************************
$sqlite['resource'] = new SQLite3($sqlite['path']);

if (isset($_GET['page_num'])) {
	//****************************************************
	//Parameters from JavaScript.
	//****************************************************
	$param = array(
		'db_table'     => sqlite_escape_string($_GET['db_table']),
		'page_num'     => sqlite_escape_string($_GET['page_num']),
		'per_page'     => sqlite_escape_string($_GET['per_page']),
		'and_or'       => sqlite_escape_string($_GET['and_or']),
		'order_second' => $_GET['order_by'],
		'search_field' => array(),
		'q_word'       => array()
	);
	//-------------------------------------------
	//search_field, q_word の処理
	//-------------------------------------------
	$esc = array('search_field', 'q_word');
	for ($i=0; $i<count($esc); $i++) {
		for ($j=0; $j<count($_GET[$esc[$i]]); $j++) {
			$param[$esc[$i]][$j] = sqlite_escape_string(
				str_replace(
					array('\\',   '%',  '_'),
					array('\\\\', '\%', '\_'),
					$_GET[$esc[$i]][$j]
				)
			);
		}
	}
	//-------------------------------------------
	//order_byの処理
	//-------------------------------------------
	$arr = array();
	for ($i=0; $i<count($param['order_second']); $i++) {
		$arr[] = sqlite_escape_string(
			'"'.$param['order_second'][$i][0].'" '.$param['order_second'][$i][1]
		);
	}
	$param['order_second'] = join(',', $arr);
	//****************************************************
	//Create a SQL. (shared by MySQL and SQLite)
	//****************************************************
	if ($param['q_word'][0] == '') {
		$param['offset']  = ($param['page_num'] - 1) * $param['per_page'];
		$query = sprintf(
			"SELECT * FROM \"%s\" ORDER BY %s LIMIT %s OFFSET %s",
			$param['db_table'],
			$param['order_second'],
			$param['per_page'],
			$param['offset']		
		);
		//whole count
		$query2 = "SELECT COUNT(*) FROM \"{$param['db_table']}\"";
	} else {
		//----------------------------------------------------
		// WHERE
		//----------------------------------------------------
		$depth1 = array();
		for($i = 0; $i < count($param['q_word']); $i++){
			$depth2 = array();
			for($j = 0; $j < count($param['search_field']); $j++){
				$depth2[] = "\"{$param['search_field'][$j]}\" LIKE '%{$param['q_word'][$i]}%' ESCAPE '\' ";
			}
			$depth1[] = '(' . join(' OR ', $depth2) . ')';
		}
		$param['where'] = join(" {$param['and_or']} ", $depth1);

		//----------------------------------------------------
		// ORDER BY
		//----------------------------------------------------
		$cnt = 0;
		$str = '(CASE ';
		for ($i = 0; $i < count($param['q_word']); $i++) {
			for ($j = 0; $j < count($param['search_field']); $j++) {
				$str .= "WHEN \"{$param['search_field'][$j]}\" = '{$param['q_word'][$i]}' ";
				$str .= "THEN $cnt ";
				$cnt++;
				$str .= "WHEN \"{$param['search_field'][$j]}\" LIKE '{$param['q_word'][$i]}%' ESCAPE '\' ";
				$str .= "THEN $cnt ";
				$cnt++;
				$str .= "WHEN \"{$param['search_field'][$j]}\" LIKE '%{$param['q_word'][$i]}%' ESCAPE '\' ";
				$str .= "THEN $cnt ";
			}
		}
		$cnt++;
		$param['orderby'] = $str . "ELSE $cnt END), {$param['order_second']}";

		//----------------------------------------------------
		// OFFSET
		//----------------------------------------------------
		$param['offset']  = ($param['page_num'] - 1) * $param['per_page'];

		$query = sprintf(
			"SELECT * FROM \"%s\" WHERE %s ORDER BY %s LIMIT %s OFFSET %s",
			$param['db_table'],
			$param['where'],
			$param['orderby'],
			$param['per_page'],
			$param['offset']		
		);

		//whole count
		$query2 = "SELECT COUNT(*) FROM \"{$param['db_table']}\" WHERE {$param['where']}";
	}
	//****************************************************
	//Query database
	//****************************************************
	//In the end, return this array to JavaScript.
	$return = array();

	//----------------------------------------------------
	//Search
	//----------------------------------------------------
	$rows = $sqlite['resource']->query($query);
	while ($row = $rows->fetchArray(SQLITE3_ASSOC)) {
		$return['result'][] = $row;
	}
	//----------------------------------------------------
	//Whole count
	//----------------------------------------------------
	$rows = $sqlite['resource']->query($query2);
	while ($row = $rows->fetchArray(SQLITE3_NUM)) {
		$return['cnt_whole'] = $row[0];
	}
	//****************************************************
	//Return
	//****************************************************
	echo json_encode($return);

} else {
	//****************************************************
	//Parameters from JavaScript.
	//****************************************************
	$param = array(
		'db_table'  => sqlite_escape_string($_GET['db_table']),
		'pkey_name' => sqlite_escape_string($_GET['pkey_name']),
		'pkey_val'  => sqlite_escape_string($_GET['pkey_val'])
	);
	//****************************************************
	//get initialize value
	//****************************************************
	$query = sprintf(
		"SELECT * FROM \"%s\" WHERE \"%s\" = '%s'",
		$param['db_table'],
		$param['pkey_name'],
		$param['pkey_val']
	);
	$rows = $sqlite['resource']->query($query);
	while ($row = $rows->fetchArray(SQLITE3_ASSOC)) echo json_encode($row);
}
//****************************************************
//End
//****************************************************
$sqlite['resource']->close();
?>
