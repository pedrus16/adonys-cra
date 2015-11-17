var module = angular.module('extranetUserModule');

module.controller('UserAddController', ['$scope', '$state', '$stateParams', 'UserService', 'resolvedRoles',
	function($scope, $state, $stateParams, UserService, resolvedRoles) {

	$scope.title = 'Créer l\'utilisateur';
	$scope.roles = resolvedRoles;
	$scope.user = {
		role: 'client'
	};

	$scope.submit = function(user) {
		UserService.create(user);
		$state.go('main.users');
	};

}]);