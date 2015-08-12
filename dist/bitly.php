<?php
//==============================================================
//Please change following variables.
// https://bitly.com/a/oauth_apps
$bitly_access_token = '7870f6436ddae5e6d1bb5f9d133fb51f915caf27';
//==============================================================

// JavaScriptへ返す配列を準備
$result  = array();

foreach ($_GET as $url) {
  if (!is_string($url)) die();
  $req = 'https://api-ssl.bitly.com/v3/shorten?format=json' .
         '&access_token=' . $bitly_access_token .
         '&longUrl=' . rawurlencode($url);
  if ($json = json_decode(file_get_contents($req), true)) $result[] = $json['data']['url'];
  else die();
}

echo json_encode($result);