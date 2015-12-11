var module = angular.module('extranetUserModule');

module.controller('UserAddController', ['$scope', '$state', '$stateParams', 'UserService', 'resolvedRoles',
	function($scope, $state, $stateParams, UserService, resolvedRoles) {

	$scope.title = 'Créer un utilisateur';
	$scope.roles = resolvedRoles;
	$scope.user = {};
	$scope.userRole = {
		value: 'ROLE_CLIENT'
	};

	$scope.submit = function(user) {
		user.roles = [
			$scope.userRole.value
		];
		UserService.create(user);
		$state.go('main.users');
	};

}]);
