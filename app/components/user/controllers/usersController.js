var module = angular.module('extranetUserModule');

module.controller('UsersController', ['$scope', '$rootScope', 'UserService', 'RoleService', 'resolvedRoles',
	function($scope, $rootScope, UserService, RoleService, resolvedRoles) {

	$scope.users = UserService;
	$scope.roles = resolvedRoles;
	$scope.roleService = RoleService;
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

	$scope.toggleFilter = function(field, value) {
		if (!$scope.users.filters.hasOwnProperty(field)) {
			$scope.users.filters[field] = [];
		}
		var index = $scope.users.filters[field].indexOf(value);
		if (index === -1) {
			$scope.users.filters[field].push(value);
		}
		else {
			$scope.users.filters[field].splice(index, 1);
		}
		$scope.users.filter();
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
