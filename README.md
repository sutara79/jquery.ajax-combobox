# jquery.ajax-combobox

A jQuery plugin for creating a text box it can auto-complete and pull-down-select.

## Demo
http://www.usamimi.info/~sutara/ajax-combobox/

## Usage

##### HTML
``` html
<head>
	<link rel="stylesheet" href="css/jquery.ajax-combobox.css">
	<script src="js/jquery.ajax-combobox.7.2.1.js"></script>
</head>
<body>
	<input type="text" id="box01">
```

##### jQuery
``` javascript
$('#box01').ajaxComboBox('foo.php');
```

## Note
##### Database
Change the value to connect Database in "**./dist/jquery.ajax-combobox.php**".  
("**./dist/jquery.ajax-combobox.php**"の文頭のデータベースの接続設定を、お使いの環境に合わせて変更して下さい。)
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
?>
```

##### button_img
Change the value of `button_img`option to your environment.

```javascript
$('#foo').ajaxComboBox(
	'bar-directory/jquery.ajax-combobox.php',
	{
		button_img: 'bar-directory/btn.png'
	}
);
```

## Extensions
+ [addComboBox](http://www.usamimi.info/~sutara/sample/addComboBox/)

+ [ajaxComboBox_for_CakePHP](https://github.com/sutara79/ajaxComboBox_for_CakePHP)


## Forked

#### jquery.suggest 1.1
- Author: Peter Vulgaris
- http://www.vulgarisoverip.com/2007/08/06/jquerysuggest-11/

#### jquery.caretpos.js 0.1
- Author: tubureteru
- http://d.hatena.ne.jp/tubureteru/20110101/

## Author
Yuusaku Miyazaki (宮崎 雄策)

- Mail: toumin.m7@gmail.com
- [Blog](http://d.hatena.ne.jp/sutara_lumpur/20090124/1232781879)

## License
[MIT License](http://www.opensource.org/licenses/mit-license.php)
