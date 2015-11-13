var module = angular.module('extranetUserModule', [
	'infinite-scroll'
]);

module.config(['$stateProvider', 'USER_ROLES', function($stateProvider, USER_ROLES) {

	$stateProvider
	.state('login', {
		url: '/login',
		templateUrl: 'app/components/user/views/login.html',
		controller: 'LoginController',
		data: {
			authorizedRoles: [USER_ROLES.all]
		}
	})
	.state('main', {
		abstract: true,
		url: '',
		controller: 'ApplicationController',
		templateUrl: 'app/shared/views/main.html',
		data: {
			authorizedRoles: [USER_ROLES.all]
		},
		resolve: {
            isAuthenticated: function (AuthenticationResolver) {
                return AuthenticationResolver.resolve();
            }
        }
	})
	.state('main.logout', {
		url: '/logout',
		controller: 'LogoutController',
		data: {
			authorizedRoles: [USER_ROLES.all]
		}
	})
	.state('main.users', {
		url:'/users',
		views: {
			'content': {
				controller: 'UsersController',
				templateUrl: 'app/components/user/views/list.html'
			}
		},
		data: {
			authorizedRoles: [USER_ROLES.admin, USER_ROLES.responsable]
		}
	})
	.state('main.users-detail', {
		url:'/users/:userId',
		views: {
			'content': {
				templateUrl: 'app/components/user/views/user.detail.html',
				controller: 'UserDetailController'
			}
		},
		data: {
			authorizedRoles: [USER_ROLES.admin, USER_ROLES.responsable]
		}
	});

}]);