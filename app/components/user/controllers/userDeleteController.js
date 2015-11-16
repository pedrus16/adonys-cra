var module = angular.module('extranetUserModule');

module.controller('UserDeleteController', [
	'$state', '$stateParams', 'UserService', 
	function($state, $stateParams, UserService) {

	UserService.delete($stateParams.userId);
	$state.go('main.users', {});

}]);