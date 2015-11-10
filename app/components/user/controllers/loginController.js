'use strict';

var module = angular.module('extranetUserModule');

module.controller('LoginController', ['$scope', '$rootScope', 'AUTHENTICATION_EVENTS', 'AuthenticationService', 'Session',
	function($scope, $rootScope, AUTHENTICATION_EVENTS, AuthenticationService, Session) {

	$scope.credentials = {
		username: 'pierre.nole@gmail.com',
		password: '123456'
	};

	$scope.login = function (credentials) {
		AuthenticationService.login(credentials).then(function (user) {
			$rootScope.$broadcast(AUTHENTICATION_EVENTS.loginSuccess);
			Session.create(user.sessionId, user.userId, user.role);
		}, function () {
			$rootScope.$broadcast(AUTHENTICATION_EVENTS.loginFailed);
		});
	};

}]);

module.controller('LogoutController', ['$scope', '$state', 'AuthenticationService', function($scope, $state, AuthenticationService) {
	AuthenticationService.logout();
	$state.go('login');
}]);