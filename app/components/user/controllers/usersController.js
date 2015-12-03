var module = angular.module('extranetUserModule');

module.controller('UsersController', ['$scope', 'UserService', 'RoleService', 'resolvedRoles',
	function($scope, UserService, RoleService, resolvedRoles) {

	$scope.users = UserService;
	$scope.roles = resolvedRoles;
	$scope.filter = {
		search: '',
		roles: []
	};
	$scope.users.pageSize = 50;
	$scope.users.sortBy = 'id';
	$scope.users.order = 'desc';
	$scope.searching = false;

	$scope.toggleSort = function(column) {
		if ($scope.users.sortBy === column) {
			$scope.users.order = $scope.users.order === 'asc' ? 'desc' : 'asc';
		}
		else {
			$scope.users.sortBy = column;
			$scope.users.order = 'asc';
		}
		$scope.users.sort();
	};

	$scope.search = function(query) {
		$scope.searching = true;
		$scope.users.search(query);
	};

	$scope.cancelSearch = function() {
		$scope.searching = false;
		$scope.filter.search = '';
		$scope.users.search('');
	};

}]);
