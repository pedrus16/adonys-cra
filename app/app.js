var extranet = angular.module('extranetApp', [
	'ngResource',
	'ngAnimate',
	'ngCookies',
	'ui.router',
	'ui.bootstrap',
	'angular-loading-bar',

	'extranetUserModule',
	'extranetReportModule',
	'adonysCalendarModule'
]);

extranet.constant('API', {
	baseUrl: 'http://localhost/extranet-api/web/app_dev.php'
});

extranet.constant('ERRORS', {
	userNotFound: 'user-not-found',
	reportNotFound: 'report-not-found',
});

extranet.controller('ApplicationController', ['$scope', function ($scope) {
	// Useless for now
}]);

extranet.controller('ErrorController', ['$scope', '$uibModalInstance', 'resolvedError',
	function ($scope, $uibModalInstance, resolvedError) {
	// Used by the error modal
	$scope.error = resolvedError;

	$scope.close = function() {
		$uibModalInstance.dismiss();
	};
}]);

extranet.config(['$stateProvider', '$urlRouterProvider', '$resourceProvider', '$httpProvider', 'USER_ROLES', 'cfpLoadingBarProvider',
	function($stateProvider, $urlRouterProvider, $resourceProvider, $httpProvider, USER_ROLES, cfpLoadingBarProvider) {

	$urlRouterProvider.otherwise('/users');
	$resourceProvider.defaults.stripTrailingSlashes = false;
	cfpLoadingBarProvider.includeSpinner = false;

	$stateProvider
	.state('main', {
		abstract: true,
		url: '',
		controller: 'ApplicationController',
		templateUrl: 'app/shared/views/main.html',
		resolve: {
            isAuthenticated: ['AuthenticationResolver', function (AuthenticationResolver) {
                return AuthenticationResolver.resolve();
            }],
            resolvedRoles: ['RoleService', function(RoleService) {
            	return RoleService.getRoles();
            }]
        }
	});

	// configure html5 to get links working on jsfiddle
	// $locationProvider.html5Mode(true);

}]);

extranet.run(['$rootScope', '$state', '$uibModal', '$log', '$http', 'AUTHENTICATION_EVENTS', 'AuthenticationService', 'USER_ROLES', 'Session', 'ERRORS',
	function ($rootScope, $state, $uibModal, $log, $http, AUTHENTICATION_EVENTS, AuthenticationService, USER_ROLES, Session, ERRORS) {

	$rootScope.userHasRole = function(roles) {
		if (roles && Array.isArray(roles)) {
			for (var i = 0; i < roles.length; ++i) {
				if (USER_ROLES.hasOwnProperty(roles[i])) {
					return true;
				}
			}
		}
		return false;
	}

	$rootScope.loggedUser = {};

	Session.getUser().then(
		function(user) {
			$rootScope.loggedUser = user;
			$rootScope.$on('$stateChangeStart', function (event, next) {
				if (next.hasOwnProperty('data') && next.data.hasOwnProperty('authorizedRoles'))
				{
					var authorizedRoles = next.data.authorizedRoles;
					if (!AuthenticationService.isAuthorized(authorizedRoles) && authorizedRoles.indexOf(USER_ROLES.ROLE_ALL) === -1) {
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

		if (error === ERRORS.userNotFound) {
			var modalInstance = $uibModal.open({
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
		}

	});

	$rootScope.$on(AUTHENTICATION_EVENTS.loginSuccess, function (event, next) {
		$http.defaults.headers.common.Authorization = 'Bearer ' + Session.user.token;
		$state.go('main.users');
  });
}]);
