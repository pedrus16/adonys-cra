var module = angular.module('extranetUserModule');

module.controller('UserAddController', ['$scope', '$state', '$stateParams', 'UserService', 'resolvedRoles',
	function($scope, $state, $stateParams, UserService, resolvedRoles) {

	$scope.title = 'Créer un utilisateur';
	$scope.roles = [];
	$scope.user = {};
	$scope.userRole = {
		value: 'ROLE_CLIENT'
	};

	for (var role in resolvedRoles) {
		$scope.roles.push({
			key: role,
			value: resolvedRoles[role]
		});
	}

	$scope.submit = function(user) {
		user.roles = [
			$scope.userRole.value
		];
		UserService.create(user);
		$state.go('main.users');
	};

}]);
