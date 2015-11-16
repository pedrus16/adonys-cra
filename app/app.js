var extranet = angular.module('extranetApp', [
	'ngResource',
	'ngAnimate',
	'ui.router',
	'ui.bootstrap',
	'extranetUserModule',
	'extranetMonthlyReportModule'
]);

extranet.controller('ApplicationController', ['$scope', function ($scope) {
	// Useless for now
}]);

extranet.controller('ErrorController', ['$scope', '$uibModalInstance', 'resolvedError', 
	function ($scope, $uibModalInstance, resolvedError) {
	// Used by the error modal
	$scope.error = resolvedError;
}]);

extranet.config(['$stateProvider', '$urlRouterProvider', '$resourceProvider', 'USER_ROLES',
	function($stateProvider, $urlRouterProvider, $resourceProvider, USER_ROLES) {
	
	$urlRouterProvider.otherwise('/users');
	$resourceProvider.defaults.stripTrailingSlashes = false;

	$stateProvider
	.state('main', {
		abstract: true,
		url: '',
		controller: 'ApplicationController',
		templateUrl: 'app/shared/views/main.html',
		data: {
			authorizedRoles: [USER_ROLES.all]
		},
		resolve: {
            isAuthenticated: ['AuthenticationResolver', function (AuthenticationResolver) {
                return AuthenticationResolver.resolve();
            }]
        }
	});

	// configure html5 to get links working on jsfiddle
	// $locationProvider.html5Mode(true);

}]);

extranet.run(['$rootScope', '$state', '$uibModal','AUTHENTICATION_EVENTS', 'AuthenticationService', 'USER_ROLES', 'Session',
	function ($rootScope, $state, $uibModal, AUTHENTICATION_EVENTS, AuthenticationService, USER_ROLES, Session) {

	Session.getUser().then(
		function(user) {
			$rootScope.$on('$stateChangeStart', function (event, next) {
				if (next.data.hasOwnProperty('authorizedRoles'))
				{
					var authorizedRoles = next.data.authorizedRoles;
					if (!AuthenticationService.isAuthorized(authorizedRoles) && authorizedRoles.indexOf(USER_ROLES.all) === -1) {
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

	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {

		$uibModal.open({
			animation: true,
			templateUrl: 'app/shared/views/error.html',
			controller: 'ErrorController',
			size: 'sm',
			resolve: {
				resolvedError: function() {
					return error;
				}
			}
		});

	});

	$rootScope.$on(AUTHENTICATION_EVENTS.loginSuccess, function (event, next) {
		$state.go('main.users');
    });
}]);