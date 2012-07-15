<?php
class Nation extends AppModel {
	public $name = 'Nation';
	public $useTable = 'nation';
	
	//****************************************************
	//Change the method according to the kind of database.
	//****************************************************
	public function escapeForDB($str) {
		$db = ConnectionManager::$config->{$this->useDbConfig}['datasource'];
		if (preg_match('/sqlite/i', $str)) return sqlite_escape_string($str);
		else return mysql_escape_string($str);
	}
	//****************************************************
	//Search
	//****************************************************
	public function modelAjaxSearch($not_escaped) {
		if (isset($not_escaped['page_num'])) {
			//****************************************************
			//Parameters from JavaScript.
			//****************************************************
			$param = array(
				'db_table'     => $this->escapeForDB($not_escaped['db_table']),
				'page_num'     => $this->escapeForDB($not_escaped['page_num']),
				'per_page'     => $this->escapeForDB($not_escaped['per_page']),
				'and_or'       => $this->escapeForDB($not_escaped['and_or']),
				'order_by'     => $this->escapeForDB($not_escaped['order_by']),
				'order_field'  => array(),
				'search_field' => array(),
				'q_word'       => array()
			);
			$esc = array('order_field', 'search_field', 'q_word');
			for ($i=0; $i<count($esc); $i++) {
				for ($j=0; $j<count($not_escaped[$esc[$i]]); $j++) {
					$param[$esc[$i]][$j] = $this->escapeForDB($not_escaped[$esc[$i]][$j]);
				}
			}

			//****************************************************
			//Create a SQL. (shared by MySQL and SQLite)
			//****************************************************
			//----------------------------------------------------
			//conditions
			//----------------------------------------------------
			$conditions = array();
			for ($i=0; $i<count($param['q_word']); $i++) {
				for ($j=0; $j<count($param['search_field']); $j++) {
					$conditions[$param['and_or']][$i]['OR']["{$param['search_field'][$j]} LIKE"] = "%{$param['q_word'][$i]}%";
				}
			}
			//----------------------------------------------------
			//order
			//----------------------------------------------------
			$order = "(CASE ";
			for ($i=0, $cnt=0; $i<count($param['order_field']); $i++) {
				for ($j=0; $j<count($param['q_word']); $j++) {
					$param['q_word'][$j] = $this->escapeForDB($param['q_word'][$j]);
					$order .= "WHEN {$param['order_field'][$i]} = '{$param['q_word'][$j]}' THEN $cnt ";
					$cnt++;
					$order .= "WHEN {$param['order_field'][$i]} LIKE '{$param['q_word'][$j]}%' THEN $cnt ";
					$cnt++;
					$order .= "WHEN {$param['order_field'][$i]} LIKE '%{$param['q_word'][$j]}%' THEN $cnt ";
				}
			}
			$cnt++;
			$order .= "ELSE $cnt END)";
			//----------------------------------------------------
			//parameters
			//----------------------------------------------------
			$arr_params = array(
				'conditions' => $conditions,
				'order'      => $order,
				'limit'      => $param['per_page'],
				'page'       => $param['page_num'],
				'recursive'  => 0
			);
			$data = $this->find('all', $arr_params);
			
			$return = array();
			for($i=0; $i<count($data); $i++){
				$return['result'][] = $data[$i][$this->name];
			}
			$return['cnt_whole'] = $this->find('count', array(
				'conditions' => $arr_params['conditions'],
				'recursive'  => 0
			));
			return json_encode($return);

		} else {
			//****************************************************
			//Parameters from JavaScript.
			//****************************************************
			$param = array(
				'pkey_name' => $this->escapeForDB($not_escaped['pkey_name']),
				'pkey_val'  => $this->escapeForDB($not_escaped['pkey_val'])
			);
			//****************************************************
			//get initialize value
			//****************************************************
			$arr_params = array(
				'conditions' => array($param['pkey_name'] => $param['pkey_val'])
			);
			$data = $this->find('all', $arr_params);
			echo json_encode($data[0][$this->name]);
		}
	}
}
