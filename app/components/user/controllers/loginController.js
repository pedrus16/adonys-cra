var module = angular.module('extranetUserModule');

module.controller('LoginController', ['$scope', '$rootScope', 'AUTHENTICATION_EVENTS', 'AuthenticationService', 'Session',
	function($scope, $rootScope, AUTHENTICATION_EVENTS, AuthenticationService, Session) {

	$scope.credentials = {
		username: 'pierre.nole@gmail.com',
		password: 'pierre'
	};

	$scope.login = function (username, password) {
		AuthenticationService.login(username, password).then(function (user) {
			Session.create(user.id, user.token, user.id, 'admin');
			$rootScope.$broadcast(AUTHENTICATION_EVENTS.loginSuccess);
		}, function () {
			$rootScope.$broadcast(AUTHENTICATION_EVENTS.loginFailed);
		});
	};

}]);
