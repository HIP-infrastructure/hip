<?php

if(class_exists('\\OCP\\AppFramework\\Http\\EmptyContentSecurityPolicy')) {
     
	$manager = \OC::$server->getContentSecurityPolicyManager();
	$policy = new \OCP\AppFramework\Http\EmptyContentSecurityPolicy();
	$policy->addAllowedFrameDomain('*');
	$manager->addDefaultPolicy($policy);
}

?>