<?php
//++++++++++++++++++++++++++++++++++++++++++++++++++++
//You MUST change this value.
$mysql = array(
	'server'   => 'localhost',
	'database' => 'acbox',
	'user'     => 'root',
	'passwd'   => '',
	'encode'   => 'utf8'
);
//++++++++++++++++++++++++++++++++++++++++++++++++++++


//****************************************************
//Connect to Database.
//****************************************************
$mysql['resource'] = mysql_connect(
	$mysql['server'],
	$mysql['user'],
	$mysql['passwd']
);
mysql_select_db($mysql['database'], $mysql['resource']);
mysql_query("SET NAMES {$mysql['encode']}");


if (isset($_GET['page_num'])) {
	//****************************************************
	//Parameters from JavaScript.
	//****************************************************
	$param = array(
		'db_table'     => mysql_escape_string($_GET['db_table']),
		'page_num'     => mysql_escape_string($_GET['page_num']),
		'per_page'     => mysql_escape_string($_GET['per_page']),
		'and_or'       => mysql_escape_string($_GET['and_or']),
		'select_field' => mysql_escape_string($_GET['select_field']),
		'primary_key'  => mysql_escape_string($_GET['primary_key']),
		'order_by'     => mysql_escape_string($_GET['order_by']),
		'order_field'  => array(),
		'search_field' => array(),
		'q_word'       => array()
	);
	$esc = array('order_field', 'search_field', 'q_word');
	for ($i=0; $i<count($esc); $i++) {
		for ($j=0; $j<count($_GET[$esc[$i]]); $j++) {
			$param[$esc[$i]][$j] = mysql_escape_string($_GET[$esc[$i]][$j]);
		}
	}

	//****************************************************
	//Create a SQL. (shared by MySQL and SQLite)
	//****************************************************
	//----------------------------------------------------
	// WHERE
	//----------------------------------------------------
	$depth1 = array();
	for($i = 0; $i < count($param['q_word']); $i++){
		$depth2 = array();
		for($j = 0; $j < count($param['search_field']); $j++){
			$depth2[] = "{$param['search_field'][$j]} LIKE '%{$param['q_word'][$i]}%'";
		}
		$depth1[] = '(' . join(' OR ', $depth2) . ')';
	}
	$param['where'] = join(" {$param['and_or']} ", $depth1);

	//----------------------------------------------------
	// ORDER BY
	//----------------------------------------------------
	$str = '(CASE ';
	for ($i = 0, $j = 0; $i < count($param['q_word']); $i++) {
		for ($k = 0; $k < count($param['order_field']); $k++) {
			$str .= "WHEN {$param['order_field'][$k]} LIKE '{$param['q_word'][$i]}' ";
			$str .= "THEN $j ";
			$j++;
			$str .= "WHEN {$param['order_field'][$k]} LIKE '{$param['q_word'][$i]}%' ";
			$str .= "THEN $j ";
			$j++;
		}
	}
	$param['orderby'] = $str . "ELSE $j END) {$param['order_by']}";

	//----------------------------------------------------
	// OFFSET
	//----------------------------------------------------
	$param['offset']  = ($param['page_num'] - 1) * $param['per_page'];


	$query = sprintf(
		"SELECT %s, %s FROM %s WHERE %s ORDER BY %s LIMIT %s OFFSET %s",
		$param['select_field'],
		$param['primary_key'],
		$param['db_table'],
		$param['where'],
		$param['orderby'],
		$param['per_page'],
		$param['offset']		
	);

	//****************************************************
	//Query database
	//****************************************************
	//In the end, return this array to JavaScript.
	$return = array();

	//----------------------------------------------------
	//Search
	//----------------------------------------------------
	$rows = mysql_query($query, $mysql['resource']);
	while ($row = mysql_fetch_array($rows, MYSQL_ASSOC)) {
		$return['result'][] = $row;
	}
	//----------------------------------------------------
	//Whole
	//----------------------------------------------------
	$query = "SELECT COUNT(*) FROM {$param['db_table']} WHERE {$param['where']}";
	$rows = mysql_query($query, $mysql['resource']);
	while ($row = mysql_fetch_array($rows, MYSQL_NUM)) {
		$return['cnt_whole'] = $row[0];
	}

	//****************************************************
	//End.
	//****************************************************
	echo json_encode($return);
} else {
	//****************************************************
	//Parameters from JavaScript.
	//****************************************************
	$param = array(
		'db_table'  => mysql_escape_string($_GET['db_table']),
		'field'     => mysql_escape_string($_GET['field']),
		'pkey_name' => mysql_escape_string($_GET['pkey_name']),
		'pkey_val'  => mysql_escape_string($_GET['pkey_val'])
	);
	//****************************************************
	//get initialize value
	//****************************************************
	$query = sprintf(
		"SELECT %s, %s FROM %s WHERE %s = '%s'",
		$param['field'],
		$param['pkey_name'],
		$param['db_table'],
		$param['pkey_name'],
		$param['pkey_val']
	);
	$rows  = mysql_query($query, $mysql['resource']);
	while ($row = mysql_fetch_array($rows, MYSQL_ASSOC)) echo json_encode($row);
}

//****************************************************
//End
//****************************************************
mysql_close($mysql['resource']);
?>
