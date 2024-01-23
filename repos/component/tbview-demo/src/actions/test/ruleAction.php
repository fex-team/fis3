<?php
class ruleAction extends Bingo_Action_Abstract
{
	public function execute()
	{
		var_dump(Bingo_Http_Request::getRouterParam('id'));
		echo "\ntest/rule\n";
	}
}