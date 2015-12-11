var module = angular.module('extranetUserModule');

module.controller('UserEditController', ['$scope', '$state', 'UserService', 'resolvedUser', 'resolvedRoles',
	function($scope, $state, UserService, resolvedUser, resolvedRoles) {

	$scope.title = 'Modifier l\'utilisateur';
	$scope.roles = resolvedRoles;
	$scope.user = resolvedUser;
	$scope.userRole = {
		value: $scope.user.roles[0] || 'ROLE_CLIENT'
	};

	$scope.submit = function(user) {
		user.roles = [
			$scope.userRole.value
		];
		UserService.update(user, function(updatedUser) {
			$state.go('main.user-detail', { userId: updatedUser.id }, { reload: true });
		});
	};

}]);
