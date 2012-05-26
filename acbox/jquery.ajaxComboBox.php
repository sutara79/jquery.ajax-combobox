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
		'q_word'       => mysql_escape_string($_GET['q_word']),
		'page_num'     => mysql_escape_string($_GET['page_num']),
		'per_page'     => mysql_escape_string($_GET['per_page']),
		'field'        => mysql_escape_string($_GET['field']),
		'search_field' => mysql_escape_string($_GET['search_field']),
		'and_or'       => mysql_escape_string($_GET['and_or']),
		'show_field'   => mysql_escape_string($_GET['show_field']),
		'hide_field'   => mysql_escape_string($_GET['hide_field']),
		'select_field' => mysql_escape_string($_GET['select_field']),
		'order_field'  => mysql_escape_string($_GET['order_field']),
		'primary_key'  => mysql_escape_string($_GET['primary_key']),
		'order_by'     => mysql_escape_string($_GET['order_by'])
	);


	//****************************************************
	//Arrange parameters.
	//****************************************************
	$param['offset']       = ($param['page_num'] - 1) * $param['per_page'];
	$param['q_word']       = preg_split('/[\s　]+/u', $param['q_word']);
	$param['search_field'] = preg_split('/[\s　]*,[\s　]*/u', trim($param['search_field']));
	$param['order_field']  = preg_split('/[\s　]*,[\s　]*/u', trim($param['order_field']));
	$param['hide_field']   = preg_split('/[\s　]*,[\s　]*/u', trim($param['hide_field']));
	$param['show_field']   = ($param['show_field'])
		? preg_split('/[\s　]*,[\s　]*/u', trim($param['show_field']))
		: array(false);


	//****************************************************
	//Create a SQL.
	//****************************************************
	//----------------------------------------------------
	// SELECT
	//----------------------------------------------------
	$query  = "SELECT {$param['select_field']} ";

	//----------------------------------------------------
	// FROM
	//----------------------------------------------------
	$query .= "FROM {$param['db_table']} ";

	//----------------------------------------------------
	// WHERE
	//----------------------------------------------------
	$where = 'WHERE ';

	for($i = 0; $i < count($param['q_word']); $i++){
		if($i == 0){
			$where .= '( ';
		}else{
			$where .= ") {$param['and_or']} ( ";
		}
	
		for($j = 0; $j < count($param['search_field']); $j++){
			if($j > 0) $where .= 'OR ';
			$where .= "{$param['search_field'][$j]} LIKE '%{$param['q_word'][$i]}%' ";
		}	
	}
	$where .= ') ';
	$query .= $where;
	//----------------------------------------------------
	// ORDER BY
	//----------------------------------------------------
	$query .= 'ORDER BY ( CASE ';

	for (
		$i = 0, $j = 0;
		$i < count($param['q_word']);
		$i++
	) {
		for ($k = 0; $k < count($param['order_field']); $k++) {
			$query .= "WHEN {$param['order_field'][$k]} LIKE '{$param['q_word'][$i]}' ";
			$query .= "THEN $j ";
			$j++;
			$query .= "WHEN {$param['order_field'][$k]} LIKE '{$param['q_word'][$i]}%' ";
			$query .= "THEN $j ";
			$j++;
		}
	}

	$query .= "ELSE $j END ) {$param['order_by']} ";

	//----------------------------------------------------
	// LIMIT, OFFSET
	//----------------------------------------------------
	$query .= "LIMIT {$param['per_page']} ";
	$query .= "OFFSET {$param['offset']} ";


	//****************************************************
	//DBへ問い合わせる
	//****************************************************
	$rows  = mysql_query($query, $mysql['resource']);

	//In the end, return this array to JavaScript.
	$return = array();

	for (
		$row = null, $i = 0, $return['cnt_page'] = 0;
		$row = mysql_fetch_array($rows, MYSQL_ASSOC);
		$i++, $return['cnt_page']++
	) {
		foreach($row as $key => $value){

			// for "select_only" option
			if($key == $param['primary_key']){
				$return['primary_key'][] = $value;
			}

			// get the value for autocomplete candidate
			if($key == $param['field']){
				$return['candidate'][] = $value;

			} else {

				// for Sub-info
				if(!in_array($key, $param['hide_field'])){
					if(
						$param['show_field'][0] !== false
						&& !in_array('*',  $param['show_field'])
						&& !in_array($key, $param['show_field'])
					){
						continue;
					}

					$return['subinfo'][$i][] = array(
						0 => $key,
						1 => $value
					);
				}
			}
		}
	}


	//****************************************************
	//Get all the number of records.
	//****************************************************
	$query = "SELECT * FROM {$param['db_table']} $where";
	$return['cnt_whole'] = mysql_num_rows(mysql_query($query, $mysql['resource']));


	//****************************************************
	//End.
	//****************************************************
	echo json_encode($return);
	
} else {
	//****************************************************
	//Parameters from JavaScript.
	//****************************************************
	$param = array(
		'db_table'    => mysql_escape_string($_GET['db_table']),
		'q_word'      => mysql_escape_string($_GET['q_word']),
		'field'       => mysql_escape_string($_GET['field']),
		'primary_key' => mysql_escape_string($_GET['primary_key'])
	);
	

	//****************************************************
	//get initialize value
	//****************************************************
	$query = "

		SELECT   {$param['field']}
		FROM     {$param['db_table']}
		WHERE    {$param['primary_key']} = '{$param['q_word']}'

	";
	$rows  = mysql_query($query, $mysql['resource']);

	while ($row = mysql_fetch_array($rows, MYSQL_NUM))
	{
		echo $row[0];
	}
}

mysql_close($mysql['resource']);

?>
