var module = angular.module('extranetUserModule');

module.controller('UsersController', ['$scope', 'UserService', function($scope, UserService) {

	$scope.users = UserService;
	$scope.filter = {
		search: ''
	};
	$scope.users.pageSize = 50;
	$scope.users.sortBy = 'id';
	$scope.users.order = 'asc';

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

}]);