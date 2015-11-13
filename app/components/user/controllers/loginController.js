var module = angular.module('extranetUserModule');

module.controller('LoginController', ['$scope', '$rootScope', 'AUTHENTICATION_EVENTS', 'AuthenticationService', 'Session',
	function($scope, $rootScope, AUTHENTICATION_EVENTS, AuthenticationService, Session) {

	$scope.credentials = {
		username: 'pierre.nole@gmail.com',
		password: '123456'
	};

	$scope.login = function (username, password) {
		AuthenticationService.login(username, password).then(function (user) {
			$rootScope.$broadcast(AUTHENTICATION_EVENTS.loginSuccess);
			Session.create(user.sessionId, user.userId, user.role);
		}, function () {
			$rootScope.$broadcast(AUTHENTICATION_EVENTS.loginFailed);
		});
	};

}]);