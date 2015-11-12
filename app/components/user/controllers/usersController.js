var module = angular.module('extranetUserModule');

module.controller('UsersController', ['$scope', 'UserService', function($scope, UserService) {

	$scope.users = UserService;
	$scope.filter = {
		search: ''
	};

}]);