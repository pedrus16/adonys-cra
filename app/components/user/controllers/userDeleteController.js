var module = angular.module('extranetUserModule');

module.controller('UserDeleteController', ['$stateParams', '$state', 'UserService', 
	function($stateParams, $state, UserService) {

	UserService.delete($stateParams.userId);
	$state.go('main.users', {});

}]);