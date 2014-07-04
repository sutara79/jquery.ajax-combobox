# jquery.ajaxComboBox

A jQuery plugin for creating a text box it can auto-complete and pull-down-select.

## Demo
http://www.usamimi.info/~sutara/ajaxComboBox/

## JSDoc
http://www.usamimi.info/~sutara/ajaxComboBox/JSDoc


## Usage

##### HTML
``` html
<head>
	<link rel="stylesheet" href="css/jquery.ajaxComboBox.css">
	<script src="js/jquery.ajaxComboBox.0.0.js"></script>
</head>
<body>
	<input type="text" id="box01">
```

##### jQuery
``` javascript
$('#box01').ajaxComboBox('foo.php');
```

## Note
Change the value to connect Database in "**./acbox/jquery.ajaxComboBox.php**".
("**./acbox/jquery.ajaxComboBox.php**"の文頭のデータベースの接続設定を、お使いの環境に合わせて変更して下さい。)
``` php
<?php
//++++++++++++++++++++++++++++++++++++++++++++++++++++
//#### You MUST change this value. ####
$mysql = array(
	'dsn'      => 'mysql:host=localhost;dbname=acbox;charset=utf8',
	'username' => 'root',
	'password' => ''
);
$sqlite = array(
	'dsn'      => 'sqlite:../sample/sample.sqlite3',
	'username' => '',
	'password' => ''
);
new AjaxComboBox($sqlite);
//++++++++++++++++++++++++++++++++++++++++++++++++++++
```

## Extensions
+ [addComboBox](http://www.usamimi.info/~sutara/sample/addComboBox/)

+ [ajaxComboBox_for_CakePHP](https://github.com/SutaraLumpur/ajaxComboBox_for_CakePHP)


## Forked

#### jquery.suggest 1.1
+ Author: Peter Vulgaris
+ http://www.vulgarisoverip.com/2007/08/06/jquerysuggest-11/

#### jquery.caretpos.js 0.1
+ Author: tubureteru
+ http://d.hatena.ne.jp/tubureteru/20110101/


## Author
Yuusaku Miyazaki (宮崎 雄策)

+ [Mail](toumin.m7@gmail.com)
+ [Blog](http://d.hatena.ne.jp/sutara_lumpur/20090124/1232781879)


## License
[MIT License](http://www.opensource.org/licenses/mit-license.php)
