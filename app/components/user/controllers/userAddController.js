var module = angular.module('extranetUserModule');

module.controller('UserAddController', ['$scope', '$state', '$stateParams', 'UserService', function($scope, $state, $stateParams, UserService) {

	$scope.user = {
		role: 'client'
	};

	$scope.submit = function(user) {
		UserService.create(user);
		$state.go('main.users');
	};

}]);