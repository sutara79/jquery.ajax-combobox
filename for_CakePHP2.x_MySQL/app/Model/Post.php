<?php
class Post extends AppModel {
	public $name = 'Post';
	public $useTable = 'nation';
	
	public function modelAjaxSearch($not_escaped) {
		if (isset($not_escaped['page_num'])) {
			//****************************************************
			//Parameters from JavaScript.
			//****************************************************
			$param = array(
				'db_table'     => mysql_escape_string($not_escaped['db_table']),
				'page_num'     => mysql_escape_string($not_escaped['page_num']),
				'per_page'     => mysql_escape_string($not_escaped['per_page']),
				'and_or'       => mysql_escape_string($not_escaped['and_or']),
				'select_field' => mysql_escape_string($not_escaped['select_field']),
				'primary_key'  => mysql_escape_string($not_escaped['primary_key']),
				'order_by'     => mysql_escape_string($not_escaped['order_by']),
				'order_field'  => array(),
				'search_field' => array(),
				'q_word'       => array()
			);
			$esc = array('order_field', 'search_field', 'q_word');
			for ($i=0; $i<count($esc); $i++) {
				for ($j=0; $j<count($not_escaped[$esc[$i]]); $j++) {
					$param[$esc[$i]][$j] = mysql_escape_string($not_escaped[$esc[$i]][$j]);
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
			$return = array();
			//----------------------------------------------------
			//Search
			//----------------------------------------------------
			$rows = $this->query($query);
			for ($i=0; $i<count($rows); $i++) {
				$return['result'][] = $rows[$i][$param['db_table']];
			}
			//----------------------------------------------------
			//Whole
			//----------------------------------------------------
			$query = "SELECT COUNT(*) as cnt FROM {$param['db_table']} WHERE {$param['where']}";
			$rows = $this->query($query);
			$return['cnt_whole'] = $rows[0][0]['cnt'];

			//****************************************************
			//End.
			//****************************************************
			echo json_encode($return);



		} else {
			//****************************************************
			//Parameters from JavaScript.
			//****************************************************
			$param = array(
				'db_table'  => mysql_escape_string($not_escaped['db_table']),
				'field'     => mysql_escape_string($not_escaped['field']),
				'pkey_name' => mysql_escape_string($not_escaped['pkey_name']),
				'pkey_val'  => mysql_escape_string($not_escaped['pkey_val'])
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
			$rows  = $this->query($query);
			echo json_encode($rows[0][$param['db_table']]);
		}
	}
}
