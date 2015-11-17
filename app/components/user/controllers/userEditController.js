var module = angular.module('extranetUserModule');

module.controller('UserEditController', ['$scope', '$state', 'UserService', 'resolvedUser', 'resolvedRoles',
	function($scope, $state, UserService, resolvedUser, resolvedRoles) {

	$scope.title = 'Modifier l\'utilisateur';
	$scope.roles = resolvedRoles;
	$scope.user = resolvedUser;

	$scope.submit = function(user) {
		UserService.update(user, function() {
			$state.go('main.user-detail', { userId: user.id }, { reload: true });
		});
	};

}]);