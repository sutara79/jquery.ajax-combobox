# CHANGELOG: jquery.ajax-combobox

## v7.5.3
#### Deprecated
- Lowercase "asc" or "desc" in `order_by` are **deprecated**.  
  (e.g. `order_by: ['field1 asc', 'field2 desc']`)  
  In the future, lowercase "asc" or "desc" are judged to be field names.

## v7.5.0
- Extend `button_img` option to accept HTML element such as `<img>` or `<svg>`.  
  See [Document](http://www.usamimi.info/~sutara/ajax-combobox/sample/others.html#button-image).
- Change default value of `button_img` to [Octicons](https://octicons.github.com/icon/chevron-down/).

## v7.4.5
- Not to scroll to top when click page navi. fix [Issue #9](https://github.com/sutara79/jquery.ajax-combobox/issues/9).
- Make sure to display the sub info.
- Change default value of `lang` option to `en` (English).
- Move plugin files to each directory.
    - `dist/*.js` => `dist/js/*.js`
    - `dist/*.css` => `dist/css/*.css`
    - `dist/*.php` => `dist/php/*.php`
- Improve demo page.
