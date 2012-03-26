<?php
//****************************************************
//受け取ったデータの使用準備
//****************************************************
$data = array();

$db_table    = sqlite_escape_string($_GET['db_table']);
$q_word      = sqlite_escape_string($_GET['q_word']);
$field       = sqlite_escape_string($_GET['field']);
$primary_key = sqlite_escape_string($_GET['primary_key']);


//****************************************************
// connect data base
//****************************************************
$db = sqlite_open('../SQLite2/test.sqlite','0600');


//****************************************************
// get initialize value
//****************************************************
$query = "

	SELECT   $field
	FROM     $db_table
	WHERE    $primary_key = '$q_word'

";
$rows  = sqlite_query($db,$query);

while ($row = sqlite_fetch_array($rows,SQLITE_NUM))
{
	echo $row[0];
}

//****************************************************
// End
//****************************************************
// cut the connection with the data base
sqlite_close($db);

?>
