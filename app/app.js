var extranet = angular.module('extranetApp', [
	'ngResource',
	'ui.router',
	'ui.bootstrap',
	'extranetUserModule',
	'extranetMonthlyReportModule'
]);

extranet.controller('ApplicationController', ['$scope', function ($scope) {
	//Useless for now
}]);

extranet.config(['$stateProvider', '$urlRouterProvider', '$resourceProvider', function($stateProvider, $urlRouterProvider, $resourceProvider) {
	
	$urlRouterProvider.otherwise('/login');
	$resourceProvider.defaults.stripTrailingSlashes = false;

	// configure html5 to get links working on jsfiddle
	// $locationProvider.html5Mode(true);

}]);

extranet.run(['$rootScope', '$state', 'AUTHENTICATION_EVENTS', 'AuthenticationService', 'USER_ROLES', 'Session',
	function ($rootScope, $state, AUTHENTICATION_EVENTS, AuthenticationService, USER_ROLES, Session) {

	Session.getUser().then(
		function(user) {
			$rootScope.$on('$stateChangeStart', function (event, next) {
				if (next.data.hasOwnProperty('authorizedRoles'))
				{
					var authorizedRoles = next.data.authorizedRoles;
					if (!AuthenticationService.isAuthorized(authorizedRoles) && authorizedRoles.indexOf(USER_ROLES.all) == -1) {
						event.preventDefault();
						if (AuthenticationService.isAuthenticated()) {
							// user is not allowed
							$rootScope.$broadcast(AUTHENTICATION_EVENTS.notAuthorized);
							console.error('notAuthorized');
						} else {
							// user is not logged in
							$rootScope.$broadcast(AUTHENTICATION_EVENTS.notAuthenticated);
							console.error('notAuthenticated');
					    }
					}
				}
			});
		},
		function(error) {
			console.error(error);
		}
	);

	$rootScope.$on(AUTHENTICATION_EVENTS.loginSuccess, function (event, next) {
		$state.go('users');
    });
}]);