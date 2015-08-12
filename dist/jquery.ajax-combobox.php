<?php
//++++++++++++++++++++++++++++++++++++++++++++++++++++
//#### You MUST change this value. ####
$mysql = array(
  'dsn'      => 'mysql:host=localhost;dbname=test;charset=utf8;port=3360',
  'username' => 'root',
  'password' => ''
);
$sqlite = array(
  'dsn'      => 'sqlite:../sample/sample.sqlite3',
  'username' => '',
  'password' => ''
);
new AjaxComboBox($sqlite);
// new AjaxComboBox($mysql);
//++++++++++++++++++++++++++++++++++++++++++++++++++++

/**
 * コンボボックスで入力された文字列、
 * その他クライアントから送られた条件をもとにDBへ問い合わせ、
 * 結果を"echo"で返す。
 */
class AjaxComboBox {
  var $db    = null;
  var $param = null;
  var $bind  = null;
  var $query = null;

  /**
   * コンストラクタ
   * @param array DB接続用の情報を収めた連想配列
   */
  function __construct($connect) {
    $this->connectDB($connect);

    // 初期値取得、またはキーワード検索ののちにJavaScriptへ結果を返す
    echo json_encode(
      (isset($_GET['page_num'])) ?
        $this->getSearchValue() :
        $this->getInitialValue()
    );

    // DB接続を終了
    $this->db = null;
  }

  /**
   * DBと接続し、プロパティに保存する
   * @param array DB接続用の情報を収めた連想配列
   */
  function connectDB($connect) {
    $this->db = new PDO(
      $connect['dsn'],
      $connect['username'],
      $connect['password'],
      array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION)
    );
    $this->db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

    // クオーテーションをダブルクオートで統一する。(MySQLの場合のみ)
    if ($this->db->getAttribute(PDO::ATTR_DRIVER_NAME) == 'mysql') $this->db->query("SET sql_mode='ANSI_QUOTES'");
  }

  /**
   * 通常検索を行う
   * @return array ヒットしたレコードと件数を収めた連想配列
   */
  function getSearchValue() {
    $this->param = $this->validateParam();
    $this->param = $this->arrangeParam($this->param);

    // 全件取得、またはキーワード検索を行う
    $this->query = ($this->param['q_word'][0] == '') ?
      $this->makeSqlAll() :
      $this->makeSqlSuggest();

    return $this->queryDB();
  }

  /**
   * JavaScriptから送られた値を無害化する
   * @return array 無害化されたパラメータを収めた連想配列
   */
  function validateParam() {
    // GET送信されたパラメータをひとつずつ配列に格納する。
    $p = array(
      'db_table'     => $_GET['db_table'],
      'page_num'     => $_GET['page_num'],
      'per_page'     => $_GET['per_page'],
      'and_or'       => $_GET['and_or'],
      'order_by'     => $_GET['order_by'],
      'search_field' => $_GET['search_field'],
      'q_word'       => $_GET['q_word']
    );

    // 正しい値かどうかを確かめつつ無害化する。
    // ユーザ入力を信用せず、クオートで囲む。
    $p['db_table'] = '"' . $p['db_table'] . '"';
    $p['page_num'] = (is_numeric($p['page_num'])) ? $p['page_num'] : 0;
    $p['per_page'] = (is_numeric($p['per_page'])) ? $p['per_page'] : 10;
    $p['and_or'] = (preg_match('/or/iu', $p['and_or'])) ? 'OR' : 'AND';
    for ($i = 0; $i < count($p['order_by']); $i++) {
      $p['order_by'][$i] = '"' . $p['order_by'][$i][0] . '" ' . (
        (preg_match('/desc/iu', $p['order_by'][$i][1])) ? 'DESC' : 'ASC'
      );
    }
    for ($i = 0; $i < count($p['search_field']); $i++) {
      $p['search_field'][$i] = '"' . $p['search_field'][$i] . '"';
    }

    // ワイルドカードをエスケープする。
    for ($i = 0; $i < count($p['q_word']); $i++) {
      $p['q_word'][$i] = str_replace(
        array('\\',   '%',  '_'),
        array('\\\\', '\%', '\_'),
        $p['q_word'][$i]
      );
    }
    return $p;
  }

  /**
   * パラメータを整形する
   * @param array $p パラメータを収めた連想配列
   * @return array 整形後のパラメータを収めた連想配列
   */
  function arrangeParam($p) {
    // OFFSET句用
    $p['offset']  = ($p['page_num'] - 1) * $p['per_page'];
    
    // ORDER BY句用
    $p['order_by'] = join(',', $p['order_by']);
    
    // SQLite用にESCAPE節を追加する
    $p['esc'] = ($this->db->getAttribute(PDO::ATTR_DRIVER_NAME) == 'sqlite') ? "ESCAPE '\'" : '';
    return $p;
  }

  /**
   * 全件取得用のSQLを作成する
   * @return array 全件取得用と件数取得用の2種類のSQLを収めた配列
   */
  function makeSqlAll() {
    return array(
      // 全件取得用
      sprintf(
        "SELECT * FROM %s ORDER BY %s LIMIT %s OFFSET %s",
        $this->param['db_table'],
        $this->param['order_by'],
        $this->param['per_page'],
        $this->param['offset']
      ),
      // 件数取得用
      "SELECT COUNT(*) FROM {$this->param['db_table']}"
    );
  }

  /**
   * 検索用にSQLを作成する
   * @return array 検索用と件数取得用の2種類のSQLを収めた配列
   */
  function makeSqlSuggest() {
    // 明示的に初期化。
    $this->bind = array();

    // WHERE
    $depth1 = array();
    for ($i = 0; $i < count($this->param['q_word']); $i++) {
      $depth2 = array();
      for ($j = 0; $j < count($this->param['search_field']); $j++) {
        $depth2[] = "{$this->param['search_field'][$j]} LIKE ? {$this->param['esc']} ";
        $this->bind[] = '%'.$this->param['q_word'][$i].'%';
      }
      $depth1[] = '(' . join(' OR ', $depth2) . ')';
    }
    $this->param['where'] = join(" {$this->param['and_or']} ", $depth1);

    // ORDER BY
    $cnt = 0;
    $str = '(CASE ';
    for ($i = 0; $i < count($this->param['q_word']); $i++) {
      for ($j = 0; $j < count($this->param['search_field']); $j++) {
        $str .= "WHEN {$this->param['search_field'][$j]} = ? ";
        $this->bind[] = $this->param['q_word'][$i];
        $str .= "THEN $cnt ";

        $cnt++;
        $str .= "WHEN {$this->param['search_field'][$j]} LIKE ? {$this->param['esc']} ";
        $this->bind[] = $this->param['q_word'][$i].'%';
        $str .= "THEN $cnt ";

        $cnt++;
        $str .= "WHEN {$this->param['search_field'][$j]} LIKE ? {$this->param['esc']} ";
        $this->bind[] = '%'.$this->param['q_word'][$i].'%';
        $str .= "THEN $cnt ";
      }
    }
    $cnt++;
    $this->param['whole_order'] = $str . "ELSE $cnt END), {$this->param['order_by']}";

    // SQL文を返す
    return array(
      // 検索用
      sprintf(
        "SELECT * FROM %s WHERE %s ORDER BY %s LIMIT %s OFFSET %s",
        $this->param['db_table'],
        $this->param['where'],
        $this->param['whole_order'],
        $this->param['per_page'],
        $this->param['offset']
      ),
      // 件数取得用
      "SELECT COUNT(*) FROM {$this->param['db_table']} WHERE {$this->param['where']}"
    );
  }

  /**
   * DBへ問い合わせる。
   * @return array ヒットしたレコードと件数を収めた連想配列
   */
  function queryDB() {
    $return = array();
    $cnt = count($this->bind);

    // 検索する
    $sth = $this->db->prepare($this->query[0]);
    if ($cnt > 0) {
      for ($i = 0; $i < $cnt; $i++) {
        $sth->bindValue($i + 1, $this->bind[$i], PDO::PARAM_STR);
      }
    }
    $sth->execute();
    $return['result'] = $sth->fetchAll(PDO::FETCH_ASSOC);

    // 検索にヒットした件数を求める
    $sth = $this->db->prepare($this->query[1]);
    if ($cnt > 0) {
      $j = count($this->param['q_word']) * count($this->param['search_field']);
      for ($i = 0; $i < $j; $i++) {
        $sth->bindValue($i + 1, $this->bind[$i], PDO::PARAM_STR);
      }
    }
    $sth->execute();
    $row = $sth->fetch(PDO::FETCH_NUM);
    $return['cnt_whole'] = $row[0];

    // ヒットしたレコードと件数を返す
    return $return;
  }

  /**
   * コンボボックスの初期値を求める
   */
  function getInitialValue() {
    // JavaScriptから受け取った値を浄化する
    $p = array(
      'db_table'  => '"' . $_GET['db_table']  . '"',
      'pkey_name' => '"' . $_GET['pkey_name'] . '"',
      'pkey_val'  => $_GET['pkey_val']
    );

    $sth = $this->db->prepare(
      sprintf(
        "SELECT * FROM %s WHERE %s = ?",
        $p['db_table'],
        $p['pkey_name']
      )
    );
    $sth->bindValue(1, $p['pkey_val'], PDO::PARAM_STR);
    $sth->execute();
    return $sth->fetch(PDO::FETCH_ASSOC);
  }
}