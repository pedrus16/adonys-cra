var module = angular.module('extranetUserModule');

module.controller('UserDetailController', [
	'$scope', '$stateParams', 'UserService', 'resolvedUser',
	function($scope, $stateParams, UserService, resolvedUser) {

	$scope.user = resolvedUser;

}]);