var module = angular.module('extranetUserModule');

module.controller('UserDetailController', ['$scope', '$stateParams', 'UserService', function($scope, $stateParams, UserService) {

	$scope.user = UserService.getUser($stateParams.userId);

}]);