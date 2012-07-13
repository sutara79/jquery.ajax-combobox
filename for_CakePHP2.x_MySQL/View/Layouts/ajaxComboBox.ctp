<!doctype html>
<html>
	<head>
		<meta charset="UTF-8">
		<?php
			echo $this->Html->css('jquery.ajaxComboBox');
			echo $this->Html->script('http://code.jquery.com/jquery.min.js');
			echo $this->Html->script('jquery.ajaxComboBox.5.3');
		?>
		<script type="text/javascript">
			jQuery(document).ready(function($){
				$('#acbox_test').ajaxComboBox(
					'<?php echo $this->webroot ?>nations/ajax_search',
					{
						lang        : 'en',
						db_table    : 'nation',
						field       : 'name',
						init_record : <?php echo $init_record ?>,
						primary_key : 'id',
						select_only : true,
						button_img  : '<?php echo $this->webroot ?>img/jquery.ajaxComboBox.button.png'
					}
				);
			});
		</script>
	</head>
	<body>
		<?php echo $content_for_layout ?>
	</body>
</html>
