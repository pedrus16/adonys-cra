var module = angular.module('extranetUserModule');

module.controller('UserAddController', ['$scope', '$stateParams', 'UserService', function($scope, $stateParams, UserService) {

	$scope.user = {
		role: 'client'
	};

	$scope.users = UserService;

}]);