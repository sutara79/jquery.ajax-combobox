<?php
	echo $this->Form->create('edit', array('url'=>'edit'));
	echo $this->Form->text('search', array('id' => 'acbox_test'));
	echo $this->Form->end(array('label' => 'submit'));
?>
