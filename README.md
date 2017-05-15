# jquery.ajax-combobox

[![Build Status](https://travis-ci.org/sutara79/jquery.ajax-combobox.svg?branch=master)](https://travis-ci.org/sutara79/jquery.ajax-combobox)
[![codecov](https://codecov.io/gh/sutara79/jquery.ajax-combobox/branch/master/graph/badge.svg)](https://codecov.io/gh/sutara79/jquery.ajax-combobox)
[![dependencies Status](https://david-dm.org/sutara79/jquery.ajax-combobox/status.svg)](https://david-dm.org/sutara79/jquery.ajax-combobox)

jQuery plugin to create a text box which can auto-complete and pull-down-select.

![image](sample/img/001.png)

## Demo
http://www.usamimi.info/~sutara/ajax-combobox/


## Install
- [GitHub](https://github.com/sutara79/jquery.ajax-combobox): Clone or download. Only you need is `dist/`.
- [npm](https://www.npmjs.com/package/jquery.ajax-combobox): `npm i jquery.ajax-combobox`
- CDN ([jsDelivr](https://github.com/jsdelivr/jsdelivr#usage)):
    - jquery.ajax-combobox.min.js: [v7.4.5](https://cdn.jsdelivr.net/npm/jquery.ajax-combobox@7.4.5/dist/js/jquery.ajax-combobox.min.js)
    - jquery.ajax-combobox.min.css: [v7.4.5](https://cdn.jsdelivr.net/npm/jquery.ajax-combobox@7.4.5/dist/css/jquery.ajax-combobox.min.css)
    - btn.png: [v7.4.5](https://cdn.jsdelivr.net/npm/jquery.ajax-combobox@7.4.5/dist/btn.png)
    - In addition to above, `dist/php/*.php` is REQUIRED.


## Usage
###### HTML
``` html
<link rel="stylesheet" href="jquery.ajax-combobox.css">

<input type="text" id="foo">

<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="jquery.ajax-combobox.min.js"></script>
```

###### JavaScript
``` javascript
$('#foo').ajaxComboBox('jquery.ajax-combobox.php');
```

## Note
### DB
Change the value to connect DB in `dist/php/jquery.ajax-combobox.php`

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

### button_img
Change the value of `button_img`option to your environment.

```javascript
$('#foo').ajaxComboBox(
  'bar-directory/jquery.ajax-combobox.php',
  {
    button_img: '/path/to/btn.png'
  }
);
```

## Extensions
- [addComboBox](http://www.usamimi.info/~sutara/sample/addComboBox/)
- [ajaxComboBox_for_CakePHP](https://github.com/sutara79/ajaxComboBox_for_CakePHP)


## Forked
- [jquery.suggest 1.1](http://www.vulgarisoverip.com/2007/08/06/jquerysuggest-11/) (Peter Vulgaris)
- [jquery.caretpos.js 0.1](http://d.hatena.ne.jp/tubureteru/20110101/) (tubureteru)


## License
[MIT](http://www.opensource.org/licenses/mit-license.php)


## Author
[Yuusaku Miyazaki](http://d.hatena.ne.jp/sutara_lumpur/20090124/1232781879)
( <toumin.m7@gmail.com> )
