<?php
require_once('AjaxComboBox.php');
use myapp\AjaxComboBox;

//++++++++++++++++++++++++++++++++++++++++++++++++++++
//#### You MUST change this value. ####
$mysql = array(
  'dsn'      => 'mysql:host=localhost;dbname=test;charset=utf8;port=3360',
  'username' => 'root',
  'password' => ''
);
$sqlite = array(
  'dsn'      => 'sqlite:../../sample/sample.sqlite3',
  'username' => '',
  'password' => ''
);
new AjaxComboBox($sqlite);
// new AjaxComboBox($mysql);
//++++++++++++++++++++++++++++++++++++++++++++++++++++
