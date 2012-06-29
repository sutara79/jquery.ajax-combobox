<?php
class PostsController extends AppController {
	public $name = 'Posts';
	public $helpers = array('Html', 'Session');

	public function index() {
		$foo = ($this->Session->read('foo') == null)
			? 'false'
			: $this->Session->read('foo');
		$this->set('init_record', $foo);
	}
	public function edit() {
		$foo = ($this->params['data']['edit']['search_primary_key'] == null)
			? 'false'
			: "'{$this->params['data']['edit']['search_primary_key']}'";
		$this->Session->write('foo', $foo);
		$this->set('init_record', $foo);
	}
	public function ajax_search() {
		$this->layout = 'ajax';
		$this->set('data', $this->Post->modelAjaxSearch($this->params['url']));
	}
}
