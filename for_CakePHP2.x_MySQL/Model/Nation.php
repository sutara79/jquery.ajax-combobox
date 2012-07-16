<?php
class Nation extends AppModel {
	public $name = 'Nation';
	public $useTable = 'name';
	
	//****************************************************
	//Change the method according to the kind of database.
	//****************************************************
	public function escapeForDB($str, $quote=false) {
		$ds = ConnectionManager::$config->{$this->useDbConfig}['datasource'];
		//SQLite
		if (preg_match('/sqlite/i', $ds)) {
			$str = sqlite_escape_string(
				str_replace(
					array('\\', '%', '_'),
					array('\\\\', '\%', '\_'),
					$str
				)
			);
			if ($quote) $str = '"'.$str.'"';
		//MySQL
		} else {
			$str = str_replace(
				array('%', '_'),
				array('\%', '\_'),
				mysql_escape_string($str)
			);
			if ($quote) $str = '`'.$str.'`';
		}
		return $str;
	}
	//****************************************************
	//Search
	//****************************************************
	public function modelAjaxSearch($not_escaped) {
		//insert "ESCAPE '\'" if SQLite3
		$ds = ConnectionManager::$config->{$this->useDbConfig}['datasource'];
		if (preg_match('/sqlite/i', $ds)) 	$esc_sqlite = "ESCAPE '\'";
		else $esc_sqlite = '';


		if (isset($not_escaped['page_num'])) {
			//****************************************************
			//Create a SQL. (shared by MySQL and SQLite)
			//****************************************************
			//----------------------------------------------------
			//conditions
			//----------------------------------------------------
			$conditions = array();
			for ($i=0; $i<count($not_escaped['q_word']); $i++) {
				$clear_q = $this->escapeForDB($not_escaped['q_word'][$i]);
				for ($j=0; $j<count($not_escaped['search_field']); $j++) {
					$clear_s = $this->escapeForDB($not_escaped['search_field'][$j]);

					$conditions[$not_escaped['and_or']][$i]['OR']["$clear_s LIKE"] = "%$clear_q%";
				}
			}
			//----------------------------------------------------
			//order
			//----------------------------------------------------
			$order = "(CASE ";
			for ($i=0, $cnt=0; $i<count($not_escaped['order_field']); $i++) {
				$clear_o = $this->escapeForDB($not_escaped['order_field'][$i], true);
				for ($j=0; $j<count($not_escaped['q_word']); $j++) {
					$clear_q = $this->escapeForDB($not_escaped['q_word'][$j]);
					$order .= "WHEN $clear_o = '$clear_q' THEN $cnt ";
					$cnt++;
					$order .= "WHEN $clear_o LIKE '$clear_q%' $esc_sqlite THEN $cnt ";
					$cnt++;
					$order .= "WHEN $clear_o LIKE '%$clear_q%' $esc_sqlite THEN $cnt ";
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
				'limit'      => $not_escaped['per_page'],
				'page'       => $not_escaped['page_num'],
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
			//get initialize value
			//****************************************************
			$arr_params = array(
				'conditions' => array($not_escaped['pkey_name'] => $not_escaped['pkey_val'])
			);
			$data = $this->find('all', $arr_params);
			echo json_encode($data[0][$this->name]);
		}
	}
}
